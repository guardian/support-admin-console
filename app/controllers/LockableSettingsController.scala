package controllers

import java.time.OffsetDateTime

import cats.data.EitherT
import cats.implicits._
import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.StrictLogging
import controllers.LockableSettingsController.LockableSettingsResponse
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import io.circe.generic.auto._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.S3Client.S3ObjectSettings
import services.{FastlyPurger, S3Json, VersionedS3Data}

import scala.concurrent.{ExecutionContext, Future}

case class LockStatus(locked: Boolean, email: Option[String], timestamp: Option[OffsetDateTime])

object LockStatus {
  val unlocked = LockStatus(locked = false, None, None)
  def locked(email: String) = LockStatus(locked = true, Some(email), Some(OffsetDateTime.now))
}

object LockableSettingsController {
  // The model returned by this controller for GET requests
  case class LockableSettingsResponse[T](value: T, version: String, status: LockStatus, userEmail: String)
}

class LockableSettingsController[T : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  name: String,
  dataObjectSettings: S3ObjectSettings,
  fastlyPurger: Option[FastlyPurger]
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe with StrictLogging {

  private val lockObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/locks/$name.lock",
    publicRead = false,
    cacheControl = None
  )

  private val s3Client = services.S3

  private def withLockStatus(f: VersionedS3Data[LockStatus] => Future[Result]): Future[Result] =
    S3Json.getFromJson[LockStatus](lockObjectSettings)(s3Client).flatMap {
      case Right(fromS3) => f(fromS3)
      case Left(error) => Future.successful(InternalServerError(error))
    }

  private def setLockStatus(lockStatus: VersionedS3Data[LockStatus]) =
    S3Json.putAsJson(lockObjectSettings, lockStatus)(s3Client)

  private def purgeFastlyCache: EitherT[Future,String,Unit] =
    fastlyPurger
      .map(purger => EitherT(purger.purge))
      .getOrElse(EitherT.pure[Future,String](()))

  /**
    * Returns current version of the settings in s3 as json, with the lock status.
    * The s3 data is validated against the model.
    */
  def get= authAction.async { request =>
    withLockStatus { case VersionedS3Data(lockStatus, _) =>
      S3Json.getFromJson[T](dataObjectSettings)(s3Client).map {
        case Right(VersionedS3Data(value, version)) =>
          Ok(S3Json.noNulls(LockableSettingsResponse(value, version, lockStatus, request.user.email).asJson))

        case Left(error) => InternalServerError(error)
      }
    }
  }

  /**
    * Updates the file in s3 if the user currently has a lock on the file, and releases the lock if successful.
    * The POSTed json is validated against the model.
    */
  def set = authAction.async(circe.json[VersionedS3Data[T]]) { request =>
    withLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        val result: EitherT[Future, String, Unit] = for {
          _ <- EitherT(S3Json.putAsJson(dataObjectSettings, request.body)(s3Client))
          _ <- EitherT(setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion)))
        } yield ()

        result.value.map {
          case Right(_) =>
            fastlyPurger.foreach(_.purge)
            logger.info(s"Successfully published ${dataObjectSettings.key} (user ${request.user.email}")
            Ok("updated")
          case Left(error) =>
            logger.error(s"Failed to publish ${dataObjectSettings.key} (user ${request.user.email}: $error")
            InternalServerError(error)
        }
      } else {
        Future.successful(Conflict(s"You do not currently have ${dataObjectSettings.key} open for edit"))
      }
    }
  }

  /**
    * Updates the lock file if there is not already a lock
    */
  def lock = authAction.async { request =>
    withLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (!lockStatus.locked) {
        val newLockStatus = LockStatus.locked(request.user.email)

        setLockStatus(VersionedS3Data(newLockStatus, lockFileVersion)).map {
          case Right(_) =>
            logger.info(s"User ${request.user.email} took control of ${dataObjectSettings.key}")
            Ok("locked")
          case Left(error) => InternalServerError(error)
        }
      } else {
        logger.info(s"User ${request.user.email} failed to take control of ${dataObjectSettings.key} because it was already locked")
        Future.successful(Conflict(s"File ${dataObjectSettings.key} is already locked"))
      }
    }
  }

  /**
    * Updates the lock file to an unlocked status if this user currently has a lock
    */
  def unlock = authAction.async { request =>
    withLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      if (lockStatus.email.contains(request.user.email)) {
        setLockStatus(VersionedS3Data(LockStatus.unlocked, lockFileVersion)) map {
          case Right(_) =>
            logger.info(s"User ${request.user.email} unlocked ${dataObjectSettings.key}")
            Ok("unlocked")
          case Left(error) => InternalServerError(error)
        }
      } else {
        logger.info(s"User ${request.user.email} tried to unlock ${dataObjectSettings.key}, but they did not have a lock")
        Future.successful(BadRequest(s"File ${dataObjectSettings.key} is not currently locked by this user"))
      }
    }
  }

  def takecontrol = authAction.async { request =>
     withLockStatus { case VersionedS3Data(lockStatus, lockFileVersion) =>
      setLockStatus(VersionedS3Data(LockStatus.locked(request.user.email), lockFileVersion)) map {
        case Right(_) =>
          logger.info(s"User ${request.user.email} force-unlocked ${dataObjectSettings.key}, taking it from ${lockStatus.email}")
          Ok("unlocked")
        case Left(error) => InternalServerError(error)
      }
    }
  }

}
