package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.S3ObjectController
import io.circe.generic.auto._
import models.BannerDeploys
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class BannerDeployController2(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any]
)(implicit ec: ExecutionContext)
    extends S3ObjectController[BannerDeploys](
      authAction,
      components,
      stage,
      filename = "banner-deploy/channel2.json",
      runtime
    ) {}
