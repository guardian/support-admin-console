package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.{Channel, CheckoutNudgeTest}
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, DynamoPermissionsCache}

import scala.concurrent.ExecutionContext

object CheckoutNudgeController {
  val name = "checkout-nudge-tests"
}

class CheckoutNudgeController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit,
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends ChannelTestsController[CheckoutNudgeTest](
      new AuthAndPermissionActions(
        authAction,
        // all users have read access
        readPermissionAction = None,
        // users must have write access to make changes
        writePermissionAction = Some(
          new PermissionAction(
            page = CheckoutNudgeController.name,
            requiredPermission = Permission.Write,
            permissionsService,
            components.parsers,
            executionContext
          )
        )
      ),
      components,
      stage,
      lockFileName = CheckoutNudgeController.name,
      channel = Channel.CheckoutNudge,
      runtime = runtime,
      dynamoTests,
      dynamoArchivedTests,
      dynamoTestsAudit
    )
    with Circe
