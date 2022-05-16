package controllers.banner

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController
import models.{BannerTests, Channel}
import models.BannerTests._
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import services.{DynamoChannelTests, FastlyPurger}
import services.S3Client.S3ObjectSettings
import zio.ZEnv

import scala.concurrent.ExecutionContext

object BannerTestsController2 {
  val name = "banner-tests2"
}

class BannerTestsController2(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[BannerTests](
    authAction,
    components,
    stage,
    name = BannerTestsController2.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"banner/$stage/${BannerTestsController2.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${BannerTestsController2.name}.json", ws),
    runtime = runtime,
    tests => dynamo.replaceChannelTests(tests.tests, Channel.Banner2)
  ) with Circe
