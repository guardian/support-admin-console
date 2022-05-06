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

object LiveblogEpicTestsController {
  val name = "liveblog-epic-tests"
}

class LiveblogEpicTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient, stage: String,
  runtime: DefaultRuntime,
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[EpicTests](
    authAction,
    components,
    stage,
    name = LiveblogEpicTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"epic/$stage/${LiveblogEpicTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${LiveblogEpicTestsController.name}.json", ws),
    runtime = runtime,
    tests => dynamo.createOrUpdateTests(tests.tests.map(test => test.copy(channel = Some(Channel.EpicLiveblog))))
  ) with Circe
