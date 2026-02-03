package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.{Channel, SingleCheckoutTest}
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, DynamoPermissionsCache}

import scala.concurrent.ExecutionContext

object SingleCheckoutController {
  val name = "single-checkout-tests"
}

class SingleCheckoutController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoTests: DynamoChannelTests,
    dynamoArchivedTests: DynamoArchivedChannelTests,
    dynamoTestsAudit: DynamoChannelTestsAudit,
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends ChannelTestsController[SingleCheckoutTest](
      AuthAndPermissionActions.withoutPermissionsChecks(authAction),
      components,
      stage,
      lockFileName = SingleCheckoutController.name,
      channel = Channel.SingleCheckout,
      runtime = runtime,
      dynamoTests,
      dynamoArchivedTests,
      dynamoTestsAudit
    )
    with Circe
