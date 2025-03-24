package controllers

import com.gu.googleauth.AuthAction
import models.{BannerTest, Channel, SupportLandingPageTest}
import models.BannerTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests, DynamoChannelTestsAudit}
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
  dynamoTestsAudit: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends ChannelTestsController[SupportLandingPageTest](
  authAction,
  components,
  stage,
  lockFileName = SupportLandingPageController.name,
  channel = Channel.SupportLandingPage,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests,
  dynamoTestsAudit
) with Circe
