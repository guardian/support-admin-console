package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.EpicTests
import play.api.libs.ws.WSClient
import services.FastlyPurger
import services.S3Client.S3ObjectSettings

import scala.concurrent.ExecutionContext

object EpicTestsController {
  def fastlyPurger(stage: String, ws: WSClient)(implicit ec: ExecutionContext): Option[FastlyPurger] = {
    stage match {
      case "PROD" => Some(new FastlyPurger("https://support.theguardian.com/epic-tests.json", ws))
      case "CODE" => Some(new FastlyPurger("https://support.code.dev-theguardian.com/epic-tests.json", ws))
      case _ => None
    }
  }
}

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, ws: WSClient, stage: String)(implicit ec: ExecutionContext)
  extends LockableSettingsController[EpicTests](
    authAction,
    components,
    stage,
    name = "epic-tests",
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"epic/$stage/epic-tests.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = EpicTestsController.fastlyPurger(stage, ws)
  ) {
}
