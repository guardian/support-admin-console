package controllers.epic

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController
import models.{Channel, EpicTest, EpicTests}
import models.EpicTests._
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc._
import services.{DynamoChannelTests, FastlyPurger}
import services.S3Client.S3ObjectSettings
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

object EpicHoldbackTestsController {
  val name = "epic-holdback-tests"
}

class EpicHoldbackTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime,
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[EpicTests](
    authAction,
    components,
    stage,
    name = EpicHoldbackTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"epic/$stage/${EpicHoldbackTestsController.name}.json",
      publicRead = false,
      cacheControl = None,
      surrogateControl = None
    ),
    fastlyPurger = None,
    runtime = runtime,
  tests => dynamo.createOrUpdateTests(tests.tests.map(test => test.copy(channel = Some(Channel.EpicHoldback))))
  ) with Circe
