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

object EpicHoldbackTestsController {
  val name = "epic-holdback-tests"
}

class EpicHoldbackTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends ChannelTestsController[EpicTest](
  authAction,
  components,
  stage,
  lockFileName = EpicHoldbackTestsController.name,
  channel = Channel.EpicHoldback,
  runtime = runtime,
  dynamo
) with Circe
