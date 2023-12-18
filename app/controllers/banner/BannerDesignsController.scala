package controllers.banner

import com.gu.googleauth.AuthAction
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoNoLockError}
import models.{BannerDesign, BannerTest, Channel}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents, Result}
import services.{DynamoBannerDesigns, DynamoChannelTests, DynamoArchivedBannerDesigns}
import services.S3Client.S3ObjectSettings
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import io.circe.generic.auto._
import models.BannerUI.BannerDesignName

import scala.concurrent.{ExecutionContext, Future}

class BannerDesignsController(
    authAction: AuthAction[AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[ZEnv],
    dynamoDesigns: DynamoBannerDesigns,
    dynamoTests: DynamoChannelTests,
    dynamoArchivedDesigns: DynamoArchivedBannerDesigns
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  case class BannerDesignsResponse(
      bannerDesigns: List[BannerDesign],
      userEmail: String,
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

  def getAll = authAction.async { request =>
    run {
      dynamoDesigns
        .getAllBannerDesigns()
        .map { bannerDesigns =>
          val response = BannerDesignsResponse(
            bannerDesigns,
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
        .map(bannerDesign => Ok(noNulls(bannerDesign.asJson)))
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

  private def parseStatus(
      rawStatus: String): Option[models.BannerDesignStatus] =
    rawStatus.toLowerCase match {
      case "live"  => Some(models.BannerDesignStatus.Live)
      case "draft" => Some(models.BannerDesignStatus.Draft)
      case _       => None
    }

  private def getAllBannerTests(): ZIO[ZEnv, DynamoError, List[BannerTest]] = {
    import models.BannerTest._
    ZIO.collectAllPar(List(
      dynamoTests.getAllTests(Channel.Banner1),
      dynamoTests.getAllTests(Channel.Banner2)
    )).map(_.flatten)
  }

  // Returns any tests currently using the design
  private def getTestsUsingDesign(designName: String): ZIO[ZEnv, DynamoError, List[BannerTest]] =
    getAllBannerTests().map { bannerTests =>
      bannerTests
        .filter(banner => banner.variants.exists(variant => variant.template match {
          case BannerDesignName(name) if designName == name => true
          case _ => false
        }))
    }

  def setStatus(designName: String, rawStatus: String) =
    authAction.async { request =>
      run {
        logger.info(
          s"${request.user.email} is changing status to $rawStatus on: $designName")

        parseStatus(rawStatus) match {
          case Some(status) =>
            // First make sure no test variants are currently using this design
            getTestsUsingDesign(designName)
              .flatMap {
                case Nil =>
                  dynamoDesigns
                    .updateStatus(designName, status)
                    .map(_ => Ok(status.toString))
                case tests =>
                  val testNames = tests.map(banner => banner.name)
                  ZIO.succeed(BadRequest(s"Cannot change status of design $designName because it's still in use by the following test(s): ${testNames.mkString(", ")}"))
              }

          case None =>
            ZIO.succeed(BadRequest(s"Invalid status for design: $rawStatus"))
        }

      }
    }

  def archive(designName: String) =
    authAction.async { request =>
      run {
        logger.info(s"${request.user.email} is archiving banner design: $designName")
        dynamoDesigns
          .getRawDesign(designName)
          .flatMap { design =>
            dynamoArchivedDesigns.putRaw(design)
              .flatMap(_ => dynamoDesigns.deleteBannerDesign(designName))
          }
          .map(_ => Ok("archived"))
      }
    }

  def usage(designName: String) =
    authAction.async { request =>
      run {
        getTestsUsingDesign(designName)
          .map(testNames => Ok(testNames.asJson))
      }
    }
}
