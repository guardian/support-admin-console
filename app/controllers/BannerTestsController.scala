package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.{BannerTest, BannerTests}
import play.api.libs.ws.WSClient
import services.FastlyPurger
import services.S3Client.S3ObjectSettings
import play.api.libs.circe.Circe
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

object BannerTestsController {
  val name = "banner-tests"
}

class BannerTestsController(
  val authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, val stage: String,
  val runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableSettingsController[BannerTests](
    authAction,
    components,
    stage,
    name = "banner-tests",
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"banner/$stage/${BannerTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, BannerTestsController.name, ws),
    runtime = runtime
  ) with Circe with ArchiveController {

  // For the ArchiveController trait
  type T = BannerTest
  override val name = BannerTestsController.name
  override implicit val encoder = BannerTests.bannerTestEncoder
  override implicit val decoder = BannerTests.bannerTestDecoder
}
