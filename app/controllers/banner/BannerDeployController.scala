package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.S3ObjectController
import io.circe.generic.auto._
import models.BannerDeploys
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class BannerDeployController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends S3ObjectController[BannerDeploys](authAction, components, stage, filename = "banner-deploy/channel1.json", runtime) {
}
