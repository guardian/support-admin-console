package controllers

import com.gu.googleauth.AuthAction
import models.BannerTests
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import services.FastlyPurger
import services.S3Client.S3ObjectSettings
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

object BannerTestsController2 {
  val name = "banner-tests2"
}

class BannerTestsController2(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[BannerTests](
    authAction,
    components,
    stage,
    name = BannerTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"banner/$stage/${BannerTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${BannerTestsController.name}.json", ws),
    runtime = runtime
  ) with Circe
