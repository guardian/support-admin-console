package controllers

import com.gu.googleauth.AuthAction
import models.{Channel, HeaderTests}
import models.HeaderTests._
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import services.{DynamoChannelTests, FastlyPurger}
import services.S3Client.S3ObjectSettings
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

object HeaderTestsController {
  val name = "header-tests"
}

class HeaderTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient,
  stage: String,
  runtime: DefaultRuntime,
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[HeaderTests](
    authAction,
    components,
    stage,
    name = HeaderTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"header/$stage/${HeaderTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${HeaderTestsController.name}.json", ws),
    runtime = runtime,
    tests => dynamo.createOrUpdateTests(tests.tests.map(test => test.copy(channel = Some(Channel.Header))))
  )
