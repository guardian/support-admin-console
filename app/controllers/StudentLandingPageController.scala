package controllers

import play.api.mvc.ActionBuilder
import play.api.mvc.ControllerComponents
import services.DynamoArchivedChannelTests
import services.DynamoChannelTests
import services.DynamoChannelTestsAudit
import services.DynamoPermissionsCache
import com.gu.googleauth.AuthAction
import play.api.mvc.AnyContent
import models.StudentLandingPageTest
import play.api.libs.circe.Circe
import scala.concurrent.ExecutionContext
import actions.AuthAndPermissionActions
import actions.PermissionAction
import services.UserPermissions.Permission
import models.Channel

object StudentLandingPageController {
  val name = "student-landing-page-tests"
}

class StudentLandingPageController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit,
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends ChannelTestsController[StudentLandingPageTest](
      new AuthAndPermissionActions(
        authAction,
        // all users have read access
        readPermissionAction = None,
        // users must have write access to make changes
        writePermissionAction = Some(
          new PermissionAction(
            page = StudentLandingPageController.name,
            requiredPermission = Permission.Write,
            permissionsService,
            components.parsers,
            executionContext
          )
        )
      ),
      components,
      stage,
      lockFileName = StudentLandingPageController.name,
      channel = Channel.StudentLandingPage,
      runtime = runtime,
      dynamoTests,
      dynamoArchivedTests,
      dynamoTestsAudit
    )
    with Circe
