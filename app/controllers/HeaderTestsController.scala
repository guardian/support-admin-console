package controllers

import com.gu.googleauth.AuthAction
import models.{Channel, HeaderTest}
import models.HeaderTest._
import play.api.mvc.{AnyContent, ControllerComponents}
import services.DynamoChannelTests
import zio.ZEnv

import scala.concurrent.ExecutionContext

object HeaderTestsController {
  val name = "header-tests"
}

class HeaderTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext) extends ChannelTestsController[HeaderTest](
  authAction,
  components,
  stage,
  lockFileName = HeaderTestsController.name,
  channel = Channel.Header,
  runtime = runtime,
  dynamo
)
