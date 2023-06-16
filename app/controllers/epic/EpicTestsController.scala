package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{Channel, EpicTest}
import models.EpicTest._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object EpicTestsController {
  val name = "epic-tests"
}

class EpicTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
)(implicit ec: ExecutionContext) extends ChannelTestsController[EpicTest](
  authAction,
  components,
  stage,
  lockFileName = EpicTestsController.name,
  channel = Channel.Epic,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests
) with Circe
