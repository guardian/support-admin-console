package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{BannerTest, Channel}
import models.BannerTest._
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object BannerTestsController {
  val name = "banner-tests"
}

class BannerTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
)(implicit ec: ExecutionContext) extends ChannelTestsController[BannerTest](
  authAction,
  components,
  stage,
  lockFileName = BannerTestsController.name,
  channel = Channel.Banner1,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests
) with Circe
