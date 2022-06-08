package controllers

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController.LockableS3ObjectResponse
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import io.circe.generic.auto._
import models.{Channel, ChannelTest, ChannelTests, LockStatus}
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoChannelTests.DynamoNoLockError
import services.S3Client.{S3ClientError, S3ObjectSettings}
import services.{DynamoChannelTests, S3Json, VersionedS3Data}
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}

object ChannelTestsController {
  // The model returned by this controller for GET requests
  case class LockableS3ObjectResponse[T](value: T, version: String, status: LockStatus, userEmail: String)
}

/**
  * Controller for managing channel tests config in Dynamodb.
  * Uses an S3 file for lock protection to prevent concurrent editing.
  */
abstract class ChannelTestsController[T <: ChannelTest[T] : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  lockFileName: String,
  channel: Channel,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {

  private val lockObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/locks/$lockFileName.lock",
    publicRead = false,
    cacheControl = None
  )

  val s3Client = services.S3

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  private def runWithLockStatus(f: VersionedS3Data[LockStatus] => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    run {
      S3Json
        .getFromJson[LockStatus](s3Client)
        .apply(lockObjectSettings)
        .flatMap(f)
    }

  private def setLockStatus(lockStatus: VersionedS3Data[LockStatus]): ZIO[ZEnv, S3ClientError, Unit] =
    S3Json
      .updateAsJson(lockStatus)(s3Client)
      .apply(lockObjectSettings)

  /**
    * Returns current version of the object in s3 as json, with the lock status.
    * The s3 data is validated against the model.
    */
  def get = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, _) =>
      dynamo
        .getAllTests[T](channel)
        .map { channelTests =>
          val response = LockableS3ObjectResponse(
            ChannelTests(channelTests),
            "versioning-deprecated",
            lockStatus,
            request.user.email
          )
          Ok(noNulls(response.asJson))
        }
    }
  }

  /**
    * Updates the file in s3 if the user currently has a lock on the file, and releases the lock if successful.
    * The POSTed json is validated against the model.
    */
  def set = authAction.async(circe.json[VersionedS3Data[ChannelTests[T]]]) { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {

        val tests = request.body.value.tests
        val result = for {
          _ <- dynamo.replaceChannelTests(tests, channel)
          _ <- setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion))
        } yield ()

        result
          .map(_ => Ok("updated"))
          .mapError { error =>
            logger.error(s"Failed to publish $channel tests (user ${request.user.email}: $error")
            error
          }
      } else {
        IO.succeed(Conflict(s"You do not currently have $channel open for edit"))
      }
    }
  }

  /**
    * Updates the lock file if there is not already a lock
    */
  def lock = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (!lockStatus.locked) {
        val newLockStatus = LockStatus.locked(request.user.email)

        setLockStatus(VersionedS3Data(newLockStatus, lockFileVersion)).map { _ =>
          logger.info(s"User ${request.user.email} took control of $channel")
          Ok("locked")
        }
      } else {
        logger.info(s"User ${request.user.email} failed to take control of $channel because it was already locked")
        IO.succeed(Conflict(s"File $channel is already locked"))
      }
    }
  }

  /**
    * Updates the lock file to an unlocked status if this user currently has a lock
    */
  def unlock = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion)) map { _ =>
          logger.info(s"User ${request.user.email} unlocked $channel")
          Ok("unlocked")
        }
      } else {
        logger.info(s"User ${request.user.email} tried to unlock $channel, but they did not have a lock")
        IO.succeed(BadRequest(s"File $channel is not currently locked by this user"))
      }
    }
  }

  def takecontrol = authAction.async { request =>
     runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      setLockStatus(VersionedS3Data(LockStatus.locked(request.user.email), lockFileVersion)) map { _ =>
        logger.info(s"User ${request.user.email} force-unlocked $channel, taking it from ${lockStatus.email}")
        Ok("unlocked")
      }
    }
  }

  /**
    * Handlers for test list ordering
    */

  def lockList = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(s"User ${request.user.email} is locking $channel test list")

      if (!lockStatus.locked) {
        val newLockStatus = LockStatus.locked(request.user.email)

        setLockStatus(VersionedS3Data(newLockStatus, lockFileVersion)).map(_ => Ok("locked"))
      } else {
        logger.info(s"User ${request.user.email} failed to take control of $channel test list because it was already locked")
        IO.succeed(Conflict(s"File $channel is already locked"))
      }
    }
  }

  def unlockList = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(s"User ${request.user.email} is unlocking $channel test list")

      if (lockStatus.email.contains(request.user.email)) {
        setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion)).map(_ => Ok("unlocked"))
      } else {
        logger.info(s"User ${request.user.email} tried to unlock $channel test list, but they did not have a lock")
        IO.succeed(BadRequest(s"$channel test list is not currently locked by this user"))
      }
    }
  }

  def takeControlOfList = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(s"User ${request.user.email} is force-unlocking $channel test list, taking it from ${lockStatus.email}")

      setLockStatus(VersionedS3Data(LockStatus.locked(request.user.email), lockFileVersion)).map(_ => Ok("unlocked"))
    }
  }

  def reorderList = authAction.async(circe.json[List[String]]) { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        logger.info(s"${request.user.email} is reordering $channel list")

        val testNames: List[String] = request.body
        val result = for {
          _ <- dynamo.setPriorities(testNames, channel)
          _ <- setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion))
        } yield Ok("updated")

        result
          .mapError { error =>
            logger.error(s"Failed to update $channel test list (user ${request.user.email}: $error")
            error
          }
      } else {
        IO.succeed(Conflict(s"You do not currently have $channel test list open for edit"))
      }
    }
  }

  /**
    * Handlers for test editing
    */

  def updateTest = authAction.async(circe.json[T]) { request =>
    run {
      val test = request.body
      logger.info(s"${request.user.email} is updating $channel/'${test.name}'")
      dynamo
        .updateTest(test, channel, request.user.email)
        .map(_ => Ok("updated"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(s"Failed to save $channel/'${test.name}' because user ${request.user.email} does not have it locked: ${error.getMessage}")
          IO.succeed(Conflict(s"You do not currently have $channel test '${test.name}' open for edit"))
        }
    }
  }

  def createTest = authAction.async(circe.json[T]) { request =>
    run {
      val test = request.body
      logger.info(s"${request.user.email} is creating $channel/'${test.name}'")
      dynamo
        .createTest(test, channel)
        .map(_ => Ok("created"))
    }
  }

  def lockTest(testName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is locking $channel/'$testName'")
      dynamo.lockTest(testName, channel, request.user.email, force = false)
        .map(_ => Ok("locked"))
    }
  }

  def unlockTest(testName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is unlocking $channel/'$testName'")
      dynamo.unlockTest(testName, channel, request.user.email)
        .map(_ => Ok("unlocked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(s"Failed to unlock $channel/'$testName' because user ${request.user.email} does not have it locked: ${error.getMessage}")
          IO.succeed(Conflict(s"You do not currently have $channel test '$testName' open for edit"))
        }
    }
  }

  def forceLockTest(testName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is force locking $channel/'$testName'")
      dynamo.lockTest(testName, channel, request.user.email, force = false)
        .map(_ => Ok("locked"))
    }
  }

  def archiveTests = authAction.async(circe.json[List[String]]) { request =>
    run {
      logger.info(s"${request.user.email} is archiving ${request.body}")
      dynamo.updateStatuses(request.body, channel, models.Status.Archived)
        .map(_ => Ok("archived"))
    }
  }
}
