package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.{Athena, DynamoSuperMode}
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class SuperModeController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoSuperMode: DynamoSuperMode,
  athena: Athena
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe with LazyLogging {

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  def getSuperModeRows(): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoSuperMode
        .getCurrentSuperModeRows()
        .map(rows => Ok(noNulls(rows.asJson)))
    }
  }

  def getArticleData(): Action[AnyContent] = authAction.async { request =>
    run {
      val result = for {
        from <- request.getQueryString("from")
        to <- request.getQueryString("to")
        url <- request.getQueryString("url")
      } yield {
        athena
          .getArticleEpicData(from, to, url)
          .map(data => Ok(noNulls(data.asJson)))
      }

      result.getOrElse(IO.succeed(BadRequest("missing parameter")))
    }
  }
}
