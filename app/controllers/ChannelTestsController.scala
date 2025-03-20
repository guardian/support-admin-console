package controllers

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController.ChannelTestsResponse
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import io.circe.generic.auto._
import models.{Channel, ChannelTest, LockStatus}
import models.DynamoErrors._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.S3Client.{S3ClientError, S3ObjectSettings}
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, S3Json, VersionedS3Data}
import utils.Circe.noNulls
import zio.{IO, UIO, ZEnv, ZIO}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{ExecutionContext, Future}

object ChannelTestsController {
  // The model returned by this controller for GET requests
  case class ChannelTestsResponse[T](
    tests: List[T],
    status: LockStatus,
    userEmail: String
  )
}

/**
  * Controller for managing channel tests config in Dynamodb.
  * Uses an S3 file for lock protection to prevent concurrent editing.
  */
abstract class ChannelTestsController[T <: ChannelTest[T] : Decoder : Encoder](
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  lockFileName: String,
  channel: Channel,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with LazyLogging {

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

  def get = authAction.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, _) =>
      dynamoTests
        .getAllTests[T](channel)
        .map { channelTests =>
          val response = ChannelTestsResponse(
            channelTests,
            lockStatus,
            request.user.email
          )
          Ok(noNulls(response.asJson))
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
          _ <- dynamoTests.setPriorities(testNames, channel)
          _ <- setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion))
        } yield Ok("updated")

        result.tapError(error => UIO(logger.error(s"Failed to update $channel test list (user ${request.user.email}: $error")))
      } else {
        IO.succeed(Conflict(s"You do not currently have $channel test list open for edit"))
      }
    }
  }

  /**
    * Handlers for test editing
    */

  def getTest(testName: String) = authAction.async { request =>
    run {
      dynamoTests
        .getTest(testName, channel)
        .map(test => Ok(noNulls(test.asJson)))
    }
  }

  def updateTest = authAction.async(circe.json[T]) { request =>
    run {
      val test = request.body
      logger.info(s"${request.user.email} is updating $channel/'${test.name}'")
      dynamoTests
        .updateTest(test, channel, request.user.email)
        .flatMap(_ => dynamoTestsAudit.createAudit(test, request.user.email))
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
      dynamoTests
        .createTest(test, channel)
        .flatMap(newTest => dynamoTestsAudit.createAudit(newTest, request.user.email))
        .map(_ => Ok("created"))
        .catchSome { case DynamoDuplicateNameError(error) =>
          logger.warn(s"Failed to create $channel/'${test.name}' because name already exists: ${error.getMessage}")
          IO.succeed(BadRequest(s"Cannot create $channel test '${test.name}' because it already exists. Please use a different name"))
        }
    }
  }

  def lockTest(testName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is locking $channel/'$testName'")
      dynamoTests.lockTest(testName, channel, request.user.email, force = false)
        .map(_ => Ok("locked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(s"Failed to lock $channel/'$testName' because it is already locked: ${error.getMessage}")
          IO.succeed(Conflict(s"$channel test '$testName' is already locked for edit by another user, or it doesn't exist"))
        }
    }
  }

  def unlockTest(testName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is unlocking $channel/'$testName'")
      dynamoTests.unlockTest(testName, channel, request.user.email)
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
      dynamoTests.lockTest(testName, channel, request.user.email, force = true)
        .map(_ => Ok("locked"))
    }
  }

  private def parseStatus(rawStatus: String): Option[models.Status] = rawStatus.toLowerCase match {
    case "live" => Some(models.Status.Live)
    case "draft" => Some(models.Status.Draft)
    case "archived" => Some(models.Status.Archived)
    case _ => None
  }

  def setStatus(rawStatus: String) = authAction.async(circe.json[List[String]]) { request =>
    run {
      val testNames = request.body
      logger.info(s"${request.user.email} is changing status to $rawStatus on: $testNames")
      parseStatus(rawStatus) match {
        case Some(models.Status.Archived) =>
          // Special handling for archiving of tests, which are moved to another table
          dynamoTests
            .getRawTests(channel, testNames)
            // write them to the archive table
            .flatMap(dynamoArchivedTests.putAllRaw)
            // now delete them from the main table
            .flatMap(_ => dynamoTests.deleteTests(testNames, channel))
            .map { _ =>
              logger.info(s"Archived and deleted ${testNames.length} $channel tests")
              Ok(rawStatus)
            }

        case Some(status) =>
          dynamoTests.updateStatuses(testNames, channel, status)
            .map(_ => Ok(status.toString))

        case None => ZIO.succeed(BadRequest(s"Invalid status: $rawStatus"))
      }

    }
  }
}
