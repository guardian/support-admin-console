package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.S3ObjectsController
import models.BannerTest
import models.BannerTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class BannerTestArchiveController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: zio.Runtime[ZEnv]
)(implicit ec: ExecutionContext) extends S3ObjectsController[BannerTest](
  authAction,
  components,
  stage,
  path = "archived-banner-tests",
  nameGenerator = _.name,
  runtime
)
