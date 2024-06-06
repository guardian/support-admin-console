package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents, Result}
import services.Athena
import zio.{IO, ZEnv, ZIO}
import models.GroupedVariantViews.encoder
import utils.Circe.noNulls

import scala.concurrent.{ExecutionContext, Future}

class AnalyticsController(authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  athena: Athena
)(implicit ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  def getDataForVariants(channel: String, testName: String): Action[AnyContent] = authAction.async { request =>
    run {
      val result = for {
        from <- request.getQueryString("from").toRight("missing parameter")
        to <- request.getQueryString("to").toRight("missing parameter")
      } yield {
        athena
          .getVariantViews(from, to, channel, testName)
          .map(data => Ok(noNulls(data.asJson)))
      }
      result match {
        case Right(result) => result
        case Left(error) => IO.succeed(BadRequest(error))
      }
    }
  }
}
