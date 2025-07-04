package controllers

import actions.AuthAndPermissionActions
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
import zio.{Unsafe, ZIO}
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

/** Controller for managing channel tests config in Dynamodb. Uses an S3 file for lock protection to prevent concurrent
  * editing.
  */
abstract class ChannelTestsController[T <: ChannelTest[T]: Decoder: Encoder](
    authActions: AuthAndPermissionActions,
    components: ControllerComponents,
    stage: String,
    lockFileName: String,
    channel: Channel,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private val lockObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/locks/$lockFileName.lock",
    publicRead = false,
    cacheControl = None
  )

  val s3Client = services.S3

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe =>
      runtime.unsafe.runToFuture {
        f.catchAll(error => {
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          ZIO.succeed(InternalServerError(error.getMessage))
        })
      }
    }

  private def runWithLockStatus(f: VersionedS3Data[LockStatus] => ZIO[Any, Throwable, Result]): Future[Result] =
    run {
      S3Json
        .getFromJson[LockStatus](s3Client)
        .apply(lockObjectSettings)
        .flatMap(f)
    }

  private def setLockStatus(lockStatus: VersionedS3Data[LockStatus]): ZIO[Any, S3ClientError, Unit] =
    S3Json
      .updateAsJson(lockStatus)(s3Client)
      .apply(lockObjectSettings)

  def get = authActions.read.async { request =>
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

  /** Handlers for test list ordering
    */

  def lockList = authActions.write.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(s"User ${request.user.email} is locking $channel test list")

      if (!lockStatus.locked) {
        val newLockStatus = LockStatus.locked(request.user.email)

        setLockStatus(VersionedS3Data(newLockStatus, lockFileVersion)).map(_ => Ok("locked"))
      } else {
        logger.info(
          s"User ${request.user.email} failed to take control of $channel test list because it was already locked"
        )
        ZIO.succeed(Conflict(s"File $channel is already locked"))
      }
    }
  }

  def unlockList = authActions.write.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(s"User ${request.user.email} is unlocking $channel test list")

      if (lockStatus.email.contains(request.user.email)) {
        setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion)).map(_ => Ok("unlocked"))
      } else {
        logger.info(s"User ${request.user.email} tried to unlock $channel test list, but they did not have a lock")
        ZIO.succeed(BadRequest(s"$channel test list is not currently locked by this user"))
      }
    }
  }

  def takeControlOfList = authActions.write.async { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      logger.info(
        s"User ${request.user.email} is force-unlocking $channel test list, taking it from ${lockStatus.email}"
      )

      setLockStatus(VersionedS3Data(LockStatus.locked(request.user.email), lockFileVersion)).map(_ => Ok("unlocked"))
    }
  }

  def reorderList = authActions.write.async(circe.json[List[String]]) { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        logger.info(s"${request.user.email} is reordering $channel list")

        val testNames: List[String] = request.body
        val result = for {
          _ <- dynamoTests.setPriorities(testNames, channel)
          _ <- setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion))
        } yield Ok("updated")

        result.tapError(error =>
          ZIO.succeed(logger.error(s"Failed to update $channel test list (user ${request.user.email}: $error"))
        )
      } else {
        ZIO.succeed(Conflict(s"You do not currently have $channel test list open for edit"))
      }
    }
  }

  /** Handlers for test editing
    */

  def getTest(testName: String) = authActions.read.async { request =>
    run {
      dynamoTests
        .getTest(testName, channel)
        .map(test => Ok(noNulls(test.asJson)))
    }
  }

  def updateTest = authActions.write.async(circe.json[T]) { request =>
    run {
      val test = request.body
      logger.info(s"${request.user.email} is updating $channel/'${test.name}'")
      dynamoTests
        .updateTest(test, channel, request.user.email)
        .flatMap(_ => dynamoTestsAudit.createAudit(test, request.user.email))
        .map(_ => Ok("updated"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(
            s"Failed to save $channel/'${test.name}' because user ${request.user.email} does not have it locked: ${error.getMessage}"
          )
          ZIO.succeed(Conflict(s"You do not currently have $channel test '${test.name}' open for edit"))
        }
    }
  }

  def createTest = authActions.write.async(circe.json[T]) { request =>
    run {
      val test = request.body
      logger.info(s"${request.user.email} is creating $channel/'${test.name}'")
      dynamoTests
        .createTest(test, channel)
        .flatMap(newTest => dynamoTestsAudit.createAudit(newTest, request.user.email))
        .map(_ => Ok("created"))
        .catchSome { case DynamoDuplicateNameError(error) =>
          logger.warn(s"Failed to create $channel/'${test.name}' because name already exists: ${error.getMessage}")
          ZIO.succeed(
            BadRequest(
              s"Cannot create $channel test '${test.name}' because it already exists. Please use a different name"
            )
          )
        }
    }
  }

  def lockTest(testName: String) = authActions.write.async { request =>
    run {
      logger.info(s"${request.user.email} is locking $channel/'$testName'")
      dynamoTests
        .lockTest(testName, channel, request.user.email, force = false)
        .map(_ => Ok("locked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(s"Failed to lock $channel/'$testName' because it is already locked: ${error.getMessage}")
          ZIO.succeed(
            Conflict(s"$channel test '$testName' is already locked for edit by another user, or it doesn't exist")
          )
        }
    }
  }

  def unlockTest(testName: String) = authActions.write.async { request =>
    run {
      logger.info(s"${request.user.email} is unlocking $channel/'$testName'")
      dynamoTests
        .unlockTest(testName, channel, request.user.email)
        .map(_ => Ok("unlocked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(
            s"Failed to unlock $channel/'$testName' because user ${request.user.email} does not have it locked: ${error.getMessage}"
          )
          ZIO.succeed(Conflict(s"You do not currently have $channel test '$testName' open for edit"))
        }
    }
  }

  def forceLockTest(testName: String) = authActions.write.async { request =>
    run {
      logger.info(s"${request.user.email} is force locking $channel/'$testName'")
      dynamoTests
        .lockTest(testName, channel, request.user.email, force = true)
        .map(_ => Ok("locked"))
    }
  }

  private def parseStatus(rawStatus: String): Option[models.Status] = rawStatus.toLowerCase match {
    case "live"     => Some(models.Status.Live)
    case "draft"    => Some(models.Status.Draft)
    case "archived" => Some(models.Status.Archived)
    case _          => None
  }

  def setStatus(rawStatus: String) = authActions.write.async(circe.json[List[String]]) { request =>
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
          dynamoTests
            .updateStatuses(testNames, channel, status)
            .flatMap(_ => {

              /** Fetch the full data for all the updated tests and then write audits. We use .forkDaemon here to avoid
                * delaying the response to the client and instead run this task in the background.
                */
              dynamoTests
                .getTests(channel, testNames)
                .flatMap(tests => dynamoTestsAudit.createAudits(tests, request.user.email))
                .tapError(error => {
                  // Log the error but this will not affect the response to the client
                  ZIO.succeed(logger.error(s"Error creating audits after status changes: ${error.getMessage}", error))
                })
                .forkDaemon
            })
            .map(_ => Ok(status.toString))

        case None => ZIO.succeed(BadRequest(s"Invalid status: $rawStatus"))
      }

    }
  }
}
