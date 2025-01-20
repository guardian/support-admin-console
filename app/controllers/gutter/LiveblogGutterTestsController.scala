package controllers.gutter

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{GutterTest, Channel}
import models.GutterTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object LiveblogGutterTestsController {
  val name = "liveblog-gutter-tests"
}

class LiveblogGutterTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests
)(implicit ec: ExecutionContext) extends ChannelTestsController[GutterTest](
  authAction,
  components,
  stage,
  lockFileName = LiveblogGutterTestsController.name,
  channel = Channel.LiveblogGutter,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests
) with Circe
