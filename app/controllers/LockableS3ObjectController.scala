package controllers

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController.LockableS3ObjectResponse
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import io.circe.generic.auto._
import models.{ChannelTests, LockStatus}
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoChannelTests.DynamoPutError
import services.S3Client.{S3ClientError, S3ObjectSettings}
import services.{FastlyPurger, S3Json, VersionedS3Data}
import software.amazon.awssdk.services.dynamodb.model.BatchWriteItemResponse
import utils.Circe.noNulls
import zio.blocking.Blocking
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}

object LockableS3ObjectController {
  // The model returned by this controller for GET requests
  case class LockableS3ObjectResponse[T](value: T, version: String, status: LockStatus, userEmail: String)
}

/**
  * Controller for managing JSON data in a single object in S3, with lock protection to prevent concurrent editing:
  */
abstract class LockableS3ObjectController[CT <: ChannelTests[_] : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  name: String,
  dataObjectSettings: S3ObjectSettings,
  fastlyPurger: Option[FastlyPurger],
  runtime: zio.Runtime[ZEnv],
  /**
    * During the migration we write to dynamo at the same time as S3.
    * But we still read from S3, which is the source of truth for now.
    */
  dynamoWrite: CT => ZIO[ZEnv, DynamoPutError, Unit],
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {

  private val lockObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/locks/$name.lock",
    publicRead = false,
    cacheControl = None
  )

  val s3Client = services.S3

  private def runWithLockStatus(f: VersionedS3Data[LockStatus] => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      S3Json
        .getFromJson[LockStatus](s3Client)
        .apply(lockObjectSettings)
        .flatMap(f)
        .catchAll(error => {
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          IO.succeed(InternalServerError(error.getMessage))
        })
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
      S3Json
        .getFromJson[CT](s3Client)
        .apply(dataObjectSettings)
        .map { case VersionedS3Data(value, version) =>
          Ok(noNulls(LockableS3ObjectResponse(value, version, lockStatus, request.user.email).asJson))
        }
    }
  }

  /**
    * Updates the file in s3 if the user currently has a lock on the file, and releases the lock if successful.
    * The POSTed json is validated against the model.
    */
  def set = authAction.async(circe.json[VersionedS3Data[CT]]) { request =>
    runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        val result = for {
          _ <- S3Json.updateAsJson(request.body)(s3Client).apply(dataObjectSettings)
          _ <- dynamoWrite(request.body.value)
          _ <- setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion))
        } yield ()

        result
          .flatMap { _ =>
            // Even if purging fails, we have successfully published the change
            logger.info(s"Successfully published ${dataObjectSettings.key} (user ${request.user.email}")

            fastlyPurger
              .map(_.purge.map(_ => Ok("updated")))
              .getOrElse(IO.succeed(Ok("updated")))
          }
          .mapError { error =>
            logger.error(s"Failed to publish ${dataObjectSettings.key} (user ${request.user.email}: $error")
            error
          }
      } else {
        IO.succeed(Conflict(s"You do not currently have ${dataObjectSettings.key} open for edit"))
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
          logger.info(s"User ${request.user.email} took control of ${dataObjectSettings.key}")
          Ok("locked")
        }
      } else {
        logger.info(s"User ${request.user.email} failed to take control of ${dataObjectSettings.key} because it was already locked")
        IO.succeed(Conflict(s"File ${dataObjectSettings.key} is already locked"))
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
          logger.info(s"User ${request.user.email} unlocked ${dataObjectSettings.key}")
          Ok("unlocked")
        }
      } else {
        logger.info(s"User ${request.user.email} tried to unlock ${dataObjectSettings.key}, but they did not have a lock")
        IO.succeed(BadRequest(s"File ${dataObjectSettings.key} is not currently locked by this user"))
      }
    }
  }

  def takecontrol = authAction.async { request =>
     runWithLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      setLockStatus(VersionedS3Data(LockStatus.locked(request.user.email), lockFileVersion)) map { _ =>
        logger.info(s"User ${request.user.email} force-unlocked ${dataObjectSettings.key}, taking it from ${lockStatus.email}")
        Ok("unlocked")
      }
    }
  }

}
