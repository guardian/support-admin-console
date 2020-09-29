package controllers

import com.gu.googleauth.AuthAction
import models.BannerTest
import models.BannerTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class BannerTestArchiveController2(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends S3ObjectsController[BannerTest](
  authAction,
  components,
  stage,
  path = "archived-banner-tests2",
  nameGenerator = _.name,
  runtime
)
