package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc._
import models.{EpicTest, EpicTests}
import play.api.libs.ws.WSClient
import services.FastlyPurger
import services.S3Client.S3ObjectSettings

import play.api.libs.circe.Circe
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

object EpicTestsController {
  val name = "epic-tests"
}

class EpicTestsController(
  val authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, val stage: String,
  val runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableSettingsController[EpicTests](
    authAction,
    components,
    stage,
    name = EpicTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"epic/$stage/${EpicTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, EpicTestsController.name, ws),
    runtime = runtime
  ) with Circe with ArchiveController {

  // For the ArchiveController trait
  type T = EpicTest
  override val name = EpicTestsController.name
  override implicit val encoder = EpicTests.epicTestEncoder
  override implicit val decoder = EpicTests.epicTestDecoder
}
