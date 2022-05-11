package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.S3ObjectController
import io.circe.generic.auto._
import models.BannerDeploys
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class BannerDeployController2(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[BannerDeploys](authAction, components, stage, filename = "banner-deploy/channel2.json", runtime) {
}
