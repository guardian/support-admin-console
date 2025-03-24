package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents, Result}
import services.DynamoChannelTestsAudit
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class ChannelTestsAuditController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTestsAudit
)(implicit ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  def getAuditsForChannelTest(channel: String, testName: String): Action[AnyContent] = authAction.async { request =>
    run {
      dynamo.getAuditsForChannelTest(channel, testName)
        .map(tests => Ok(noNulls(tests.asJson)))
    }
  }

  def getAuditTestsDetails(): Action[AnyContent] = authAction.async { request =>
    run {
      logger.info("Getting all audit tests details")
      dynamo.getAllAuditTests().map(tests => Ok(noNulls(tests.asJson)))
    }
  }

}
