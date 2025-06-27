package controllers

import actions.AuthAndPermissionActions
import com.gu.googleauth.AuthAction
import models.{Channel, HeaderTest}
import models.HeaderTest._
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit}

import scala.concurrent.ExecutionContext

object HeaderTestsController {
  val name = "header-tests"
}

class HeaderTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[Any],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends ChannelTestsController[HeaderTest](
  AuthAndPermissionActions.withoutPermissionsChecks(authAction),
  components,
  stage,
  lockFileName = HeaderTestsController.name,
  channel = Channel.Header,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
)
