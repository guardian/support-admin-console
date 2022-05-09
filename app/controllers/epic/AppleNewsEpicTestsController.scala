package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController
import models.{Channel, EpicTest, EpicTests}
import models.EpicTests._
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._
import services.DynamoChannelTests
import services.S3Client.S3ObjectSettings
import zio.ZEnv

import scala.concurrent.ExecutionContext

object AppleNewsEpicTestsController {
  val name = "apple-news-epic-tests"
}

class AppleNewsEpicTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[EpicTests](
  authAction,
  components,
  stage,
  name = AppleNewsEpicTestsController.name,
  dataObjectSettings = S3ObjectSettings(
    bucket = "gu-contributions-public",
    key = s"epic/$stage/${AppleNewsEpicTestsController.name}.json",
    publicRead = true
  ),
  fastlyPurger = None,
  runtime = runtime,
  tests => dynamo.createOrUpdateTests(tests.tests, Channel.EpicAppleNews)
) with Circe
