package controllers.gutter

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{Channel, GutterTest}
import models.GutterTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object GutterLiveblogTestsController {
  val name = "gutter-liveblog-tests"
}

class GutterLiveblogTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends ChannelTestsController[GutterTest](
  authAction,
  components,
  stage,
  lockFileName = GutterLiveblogTestsController.name,
  channel = Channel.GutterLiveblog,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
) with Circe
