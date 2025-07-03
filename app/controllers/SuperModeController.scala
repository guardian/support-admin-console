package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoSuperMode
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class SuperModeController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[Any],
  dynamoSuperMode: DynamoSuperMode,
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe with LazyLogging {

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe => runtime.unsafe.runToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        ZIO.succeed(InternalServerError(error.getMessage))
      })
    }}

  def getSuperModeRows(): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoSuperMode
        .getCurrentSuperModeRows()
        .map(rows => Ok(noNulls(rows.asJson)))
    }
  }
}
