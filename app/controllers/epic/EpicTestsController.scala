package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController
import models.EpicTests
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._
import services.FastlyPurger
import services.S3Client.S3ObjectSettings
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
      key = s"epic/$stage/${EpicTestsController.name}-tom-10p-time.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${EpicTestsController.name}.json", ws),
    runtime = runtime
  ) with Circe
