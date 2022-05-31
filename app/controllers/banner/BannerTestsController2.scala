package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.ChannelTestsController
import models.{BannerTest, Channel}
import models.BannerTest._
import play.api.libs.circe.Circe
import play.api.mvc.{AnyContent, ControllerComponents}
import services.DynamoChannelTests
import zio.ZEnv

import scala.concurrent.ExecutionContext

object BannerTestsController2 {
  val name = "banner-tests2"
}

class BannerTestsController2(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends ChannelTestsController[BannerTest](
  authAction,
  components,
  stage,
  lockFileName = BannerTestsController.name,
  channel = Channel.Banner2,
  runtime = runtime,
  dynamo
) with Circe
