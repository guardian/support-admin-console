package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents, Result}
import services.DynamoChannelTestsAudit
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class ChannelTestsAuditController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[Any],
  dynamo: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe => runtime.unsafe.runToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        ZIO.succeed(InternalServerError(error.getMessage))
      })
    }}

  def getAuditsForChannelTest(channel: String, testName: String): Action[AnyContent] = authAction.async { request =>
    run {
      dynamo.getAuditsForChannelTest(channel, testName)
        .map(tests => Ok(noNulls(tests.asJson)))
    }
  }
}
