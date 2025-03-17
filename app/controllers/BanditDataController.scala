package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents, Result}
import services.{BigQueryService, DynamoBanditData}
import utils.Circe.noNulls
import zio.{IO, ZEnv, ZIO}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.Try

class BanditDataController(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoBanditData,
  bigQueryService: BigQueryService,
)(implicit ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  private def run(f: => ZIO[ZEnv, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
    }

  def getDataForTest(channel: String, testName: String): Action[AnyContent] = authAction.async { request =>
    run {
      val sampleCount: Option[Int] = request.getQueryString("sampleCount").flatMap(s => Try(Integer.parseInt(s)).toOption)
      dynamo
        .getDataForTest(testName, channel, sampleCount)
        .map(data => Ok(noNulls(data.asJson)))
    }
  }

  def getLTVDataForTest(testName: String, channel: String): Action[AnyContent] = authAction.async { request =>

    val query = bigQueryService.buildQuery(testName, channel, stage.toLowerCase);
    logger.info(s"Query: $query");

    val result = bigQueryService.runQuery(query) match {
      case Left(error) =>
        Left(error)
      case Right(results) =>
        val bigQueryResult = bigQueryService.getBigQueryResult(results)
        Right(bigQueryResult)

    }
    result match {
      case Left(error) =>
        Future.successful(InternalServerError(error.toString))
      case Right(data) =>
        Future.successful(Ok(noNulls(data.asJson)))
    }
  }

}
