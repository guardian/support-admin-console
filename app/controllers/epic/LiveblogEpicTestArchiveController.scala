package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.S3ObjectsController
import models.EpicTest
import models.EpicTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class LiveblogEpicTestArchiveController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: zio.Runtime[ZEnv]
)(implicit ec: ExecutionContext) extends S3ObjectsController[EpicTest](
  authAction,
  components,
  stage,
  path = "archived-liveblog-epic-tests",
  nameGenerator = _.name,
  runtime
)
