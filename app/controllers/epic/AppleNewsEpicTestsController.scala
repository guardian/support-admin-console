package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController
import models.EpicTests
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._
import services.S3Client.S3ObjectSettings
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class AppleNewsEpicTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[EpicTests](
  authAction,
  components,
  stage,
  name = LiveblogEpicTestsController.name,
  dataObjectSettings = S3ObjectSettings(
    bucket = "gu-contributions-public",
    key = s"epic/$stage/apple-news-epic-tests.json",
    publicRead = true
  ),
  fastlyPurger = None,
  runtime = runtime
) with Circe
