package controllers.banner

import com.gu.googleauth.AuthAction
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoNoLockError}
import models.{BannerDesign, LockStatus}
import play.api.libs.circe.Circe
import play.api.mvc.{
  AbstractController,
  AnyContent,
  ControllerComponents,
  Result
}
import services.{DynamoBannerDesigns, S3Json, VersionedS3Data}
import services.S3Client.{S3ClientError, S3ObjectSettings}
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import io.circe.generic.auto._

import scala.concurrent.{ExecutionContext, Future}

class BannerDesignsController(
    authAction: AuthAction[AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[ZEnv],
    dynamoDesigns: DynamoBannerDesigns,
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  case class BannerDesignsResponse(
      tests: List[BannerDesign],
      status: LockStatus,
      userEmail: String
  )

  val lockFileName = "banner-designs"

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
        logger.error(
          s"Returning InternalServerError to client: ${error.getMessage}",
          error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  private def runWithLockStatus(
      f: VersionedS3Data[LockStatus] => ZIO[ZEnv, Throwable, Result])
    : Future[Result] =
    run {
      S3Json
        .getFromJson[LockStatus](s3Client)
        .apply(lockObjectSettings)
        .flatMap(f)
    }

  def getAll = authAction.async { request =>
    runWithLockStatus {
      case VersionedS3Data(lockStatus, _) =>
        dynamoDesigns
          .getAllBannerDesigns()
          .map { bannerDesigns =>
            val response = BannerDesignsResponse(
              bannerDesigns,
              lockStatus,
              request.user.email
            )
            Ok(noNulls(response.asJson))
          }
    }
  }

  /**
    * Handlers for design editing
    */
  def get(designName: String) = authAction.async { request =>
    run {
      dynamoDesigns
        .getBannerDesign(designName)
        .map(test => Ok(noNulls(test.asJson)))
    }
  }

  def update = authAction.async(circe.json[BannerDesign]) { request =>
    run {
      val design = request.body
      logger.info(s"${request.user.email} is updating '${design.name}'")
      dynamoDesigns
        .updateBannerDesign(design, request.user.email)
        .map(_ => Ok("updated"))
        .catchSome {
          case DynamoNoLockError(error) =>
            logger.warn(
              s"Failed to save '${design.name}' because user ${request.user.email} does not have it locked: ${error.getMessage}")
            IO.succeed(Conflict(
              s"You do not currently have design '${design.name}' open for edit"))
        }
    }
  }

  def create = authAction.async(circe.json[BannerDesign]) { request =>
    run {
      val design = request.body
      logger.info(s"${request.user.email} is creating '${design.name}'")
      dynamoDesigns
        .createBannerDesign(design)
        .map(_ => Ok("created"))
        .catchSome {
          case DynamoDuplicateNameError(error) =>
            logger.warn(
              s"Failed to create '${design.name}' because name already exists: ${error.getMessage}")
            IO.succeed(BadRequest(
              s"Cannot create design '${design.name}' because it already exists. Please use a different name"))
        }
    }
  }

  def lock(designName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is locking '$designName'")
      dynamoDesigns
        .lockBannerDesign(designName, request.user.email, force = false)
        .map(_ => Ok("locked"))
        .catchSome {
          case DynamoNoLockError(error) =>
            logger.warn(
              s"Failed to lock '$designName' because it is already locked: ${error.getMessage}")
            IO.succeed(Conflict(
              s"Design '$designName' is already locked for edit by another user"))
        }
    }
  }

  def unlock(designName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is unlocking '$designName'")
      dynamoDesigns
        .unlockBannerDesign(designName, request.user.email)
        .map(_ => Ok("unlocked"))
        .catchSome {
          case DynamoNoLockError(error) =>
            logger.warn(
              s"Failed to unlock '$designName' because user ${request.user.email} does not have it locked: ${error.getMessage}")
            IO.succeed(Conflict(
              s"You do not currently have design '$designName' open for edit"))
        }
    }
  }

  def forceLock(designName: String) = authAction.async { request =>
    run {
      logger.info(s"${request.user.email} is force locking '$designName'")
      dynamoDesigns
        .lockBannerDesign(designName, request.user.email, force = true)
        .map(_ => Ok("locked"))
    }
  }
}
