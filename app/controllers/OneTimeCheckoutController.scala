package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.{Channel, OneTimeCheckoutTest}
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, DynamoPermissionsCache}

import scala.concurrent.ExecutionContext

object OneTimeCheckoutController {
  val name = "one-time-checkout-tests"
}

class OneTimeCheckoutController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit,
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends ChannelTestsController[OneTimeCheckoutTest](
      AuthAndPermissionActions.withoutPermissionsChecks(authAction),
      components,
      stage,
      lockFileName = OneTimeCheckoutController.name,
      channel = Channel.OneTimeCheckout,
      runtime = runtime,
      dynamoTests,
      dynamoArchivedTests,
      dynamoTestsAudit
    )
    with Circe
