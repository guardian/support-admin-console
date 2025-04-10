package controllers.epic

import actions.AuthAndPermissionActions
import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{Channel, EpicTest}
import models.EpicTest._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object AppleNewsEpicTestsController {
  val name = "apple-news-epic-tests"
}

class AppleNewsEpicTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends ChannelTestsController[EpicTest](
  AuthAndPermissionActions.withoutPermissionsChecks(authAction),
  components,
  stage,
  lockFileName = AppleNewsEpicTestsController.name,
  channel = Channel.EpicAppleNews,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
) with Circe
