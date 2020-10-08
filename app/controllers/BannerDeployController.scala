package controllers

import com.gu.googleauth.AuthAction
import models.BannerDeploys
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class BannerDeployController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends S3ObjectController[BannerDeploys](authAction, components, stage, filename = "banner-deploy/channel1.json", runtime) {
}
