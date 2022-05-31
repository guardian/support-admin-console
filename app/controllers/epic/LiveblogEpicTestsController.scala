package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{Channel, EpicTest}
import models.EpicTest._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoChannelTests
import zio.ZEnv

import scala.concurrent.ExecutionContext

object LiveblogEpicTestsController {
  val name = "liveblog-epic-tests"
}

class LiveblogEpicTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends ChannelTestsController[EpicTest](
  authAction,
  components,
  stage,
  lockFileName = LiveblogEpicTestsController.name,
  channel = Channel.EpicLiveblog,
  runtime = runtime,
  dynamo
) with Circe
