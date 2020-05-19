package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc._
import models.EpicTests
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
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[EpicTests](
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
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${EpicTestsController.name}.json", ws),
    runtime = runtime
  ) with Circe
