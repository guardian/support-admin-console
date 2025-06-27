package controllers.banner

import actions.AuthAndPermissionActions
import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{BannerTest, Channel}
import models.BannerTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit}

import scala.concurrent.ExecutionContext

object BannerTestsController2 {
  val name = "banner-tests2"
}

class BannerTestsController2(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[Any],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends ChannelTestsController[BannerTest](
  AuthAndPermissionActions.withoutPermissionsChecks(authAction),
  components,
  stage,
  lockFileName = BannerTestsController.name,
  channel = Channel.Banner2,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
) with Circe
