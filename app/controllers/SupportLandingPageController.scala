package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.{Channel, SupportLandingPageTest}
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, DynamoPermissionsCache}

import scala.concurrent.ExecutionContext

object SupportLandingPageController {
  val name = "support-landing-page-tests"
}

class SupportLandingPageController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit,
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends ChannelTestsController[SupportLandingPageTest](
      new AuthAndPermissionActions(
        authAction,
        // all users have read access
        readPermissionAction = None,
        // users must have write access to make changes
        writePermissionAction = Some(
          new PermissionAction(
            page = SupportLandingPageController.name,
            requiredPermission = Permission.Write,
            permissionsService,
            components.parsers,
            executionContext
          )
        )
      ),
      components,
      stage,
      lockFileName = SupportLandingPageController.name,
      channel = Channel.SupportLandingPage,
      runtime = runtime,
      dynamoTests,
      dynamoArchivedTests,
      dynamoTestsAudit
    )
    with Circe
