package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import models.Channel
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoArchivedChannelTests
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class ArchivedTestsController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoArchivedTests: DynamoArchivedChannelTests,
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe with LazyLogging {

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  def getArchivedTestsRows(): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoArchivedTests
        .getCurrentArchivedTestsRows(Channel.Epic)
        .map(rows => Ok(noNulls(rows.asJson)))
    }
  }

}
