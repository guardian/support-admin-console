package controllers

import com.gu.googleauth.AuthAction
import models.EpicTest
import models.EpicTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class AppleNewsEpicTestArchiveController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends S3ObjectsController[EpicTest](
  authAction,
  components,
  stage,
  path = "archived-apple-news-epic-tests",
  nameGenerator = _.name,
  runtime
)
