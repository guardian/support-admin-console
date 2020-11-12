package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.S3ObjectsController
import models.EpicTest
import models.EpicTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class EpicTestArchiveController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends S3ObjectsController[EpicTest](
  authAction,
  components,
  stage,
  path = "archived-epic-tests",
  nameGenerator = _.name,
  runtime
)
