package controllers

import com.gu.googleauth.AuthAction
import models.{Channel, HeaderTest}
import models.HeaderTest._
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.ZEnv

import scala.concurrent.ExecutionContext

object HeaderTestsController {
  val name = "header-tests"
}

class HeaderTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoTests: DynamoChannelTests,
  dynamoArchivedTests: DynamoArchivedChannelTests,
)(implicit ec: ExecutionContext) extends ChannelTestsController[HeaderTest](
  authAction,
  components,
  stage,
  lockFileName = HeaderTestsController.name,
  channel = Channel.Header,
  runtime = runtime,
  dynamoTests,
  dynamoArchivedTests
)
