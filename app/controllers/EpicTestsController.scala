package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.EpicTests
import models.EpicTests._
import services.S3Client.S3ObjectSettings

import scala.concurrent.ExecutionContext

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
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
    )
  ) {
}
