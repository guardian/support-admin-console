package controllers

import com.gu.googleauth.AuthAction
import models.HeaderTest
import models.HeaderTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class HeaderTestArchiveController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: zio.Runtime[ZEnv]
)(implicit ec: ExecutionContext) extends S3ObjectsController[HeaderTest](
  authAction,
  components,
  stage,
  path = "archived-header-tests",
  nameGenerator = _.name,
  runtime
)
