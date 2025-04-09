package controllers

import actions.{AuthAndPermissionActions, PermissionsAction}
import com.gu.googleauth.AuthAction
import models.{BannerTest, Channel, SupportLandingPageTest}
import models.BannerTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit, DynamoPermissionsCache}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object SupportLandingPageController {
  val name = "support-landing-page-tests"
}

class SupportLandingPageController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit,
  permissionsService: DynamoPermissionsCache
)(implicit ec: ExecutionContext) extends ChannelTestsController[SupportLandingPageTest](
  AuthAndPermissionActions(
    // all users have read access
    read = authAction,
    // users must have write access to make changes
    write = authAction andThen
      new PermissionsAction(
        page = SupportLandingPageController.name,
        requiredPermission = Permission.Write,
        permissionsService,
        components.parsers,
        ec
      ),
  ),
  components,
  stage,
  lockFileName = SupportLandingPageController.name,
  channel = Channel.SupportLandingPage,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
) with Circe
