package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc._
import models.EpicTests
import play.api.libs.ws.WSClient
import services.S3Client.S3ObjectSettings

import play.api.libs.circe.Circe
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
