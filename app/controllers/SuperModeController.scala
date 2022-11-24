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
      (request.queryString("endTimestamp").headOption, request.queryString("todayDate").headOption, request.queryString("tomorrowDate").headOption) match {
        case (Some(endTimestamp), Some(todayDate), Some(tomorrowDate)) => dynamoSuperMode.getRows(endTimestamp, todayDate, tomorrowDate)
          .map(rows => Ok(noNulls(rows.asJson)))
        case _ => IO.succeed(BadRequest("missing endTimestamp"))
      }
    }
  }

  def getArticleData(): Action[AnyContent] = authAction.async { request =>
    run {
      (request.queryString("from").headOption, request.queryString("to").headOption, request.queryString("url").headOption) match {
        case (Some(from), Some(to), Some(url)) =>
          athena
            .get(from, to, url)
            .map(data => Ok(noNulls(data.asJson)))
        case _ => IO.succeed(BadRequest("missing parameter"))
      }
    }
  }
}