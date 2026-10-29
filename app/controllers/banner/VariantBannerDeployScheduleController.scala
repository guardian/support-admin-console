package controllers.banner

import actions.AuthAndPermissionActions
import com.gu.googleauth.AuthAction
import controllers.S3ObjectController
import io.circe.generic.auto._
import models.VariantBannerDeploySchedule
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.S3Client.S3GetObjectError
import services.VersionedS3Data
import software.amazon.awssdk.services.s3.model.NoSuchKeyException
import zio.ZIO

import scala.concurrent.ExecutionContext

object VariantBannerDeployScheduleController {
  private[banner] val defaultSettings = VersionedS3Data(VariantBannerDeploySchedule.default, "")
}

class VariantBannerDeployScheduleController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any]
)(implicit ec: ExecutionContext)
    extends S3ObjectController[VariantBannerDeploySchedule](
      AuthAndPermissionActions.withoutPermissionsChecks(authAction),
      components,
      stage,
      filename = "banner-deploy/variant-schedule.json",
      runtime
    ) {

  override protected def recoverGetFromS3Error
      : PartialFunction[Throwable, ZIO[Any, Throwable, VersionedS3Data[VariantBannerDeploySchedule]]] = {
    case S3GetObjectError(_: NoSuchKeyException) =>
      ZIO.succeed(VariantBannerDeployScheduleController.defaultSettings)
    case S3GetObjectError(error) if Option(error.getMessage).exists(_.contains("The specified key does not exist")) =>
      ZIO.succeed(VariantBannerDeployScheduleController.defaultSettings)
  }
}
