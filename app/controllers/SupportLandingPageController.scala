package controllers

import com.gu.googleauth.AuthAction
import models.{Channel, SupportLandingPageTest}
import play.api.libs.circe.Circe
import play.api.mvc.{AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object SupportLandingPageController {
  val name = "support-landing-page-tests"
}

class SupportLandingPageController(
                             authAction: AuthAction[AnyContent],
                             components: ControllerComponents,
                             stage: String,
                             runtime: zio.Runtime[ZEnv],
                             dynamoTests: DynamoChannelTests,
                             dynamoArchivedTests: DynamoArchivedChannelTests,
                           )(implicit ec: ExecutionContext) extends ChannelTestsController[SupportLandingPageTest](
  authAction,
  components,
  stage,
  lockFileName = SupportLandingPageController.name,
  channel = Channel.SupportLandingPage,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests
) with Circe
