package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax.EncoderOps
import models.Channel
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
    val x = getLTVData(testName, channel,bigQueryService)
    logger.info(s"getLTVData: $x");
    run {
      val sampleCount: Option[Int] = request.getQueryString("sampleCount").flatMap(s => Try(Integer.parseInt(s)).toOption)
      dynamo
        .getDataForTest(testName, channel, sampleCount)
        .map(data => Ok(noNulls(data.asJson)))
    }
  }

  def getLTVData(testName: String, channel: String, bigQueryService: BigQueryService) = {
    logger.info(s"Start BigQuery testing")

        val projectId = s"datatech-platform-${stage.toLowerCase}"
        val query = bigQueryService.buildQuery(testName, channel, stage.toLowerCase);

        val result = bigQueryService.runQuery(query, projectId) match {
          case Left(error) =>
            Left(error)
          case Right(results) =>
            val bigQueryResult = bigQueryService.getBigQueryResult(results)
            logger.info(s"BigQueryResult: $bigQueryResult");
            Right(bigQueryResult)

        }
        logger.info(s"Result: $result");

    logger.info(s"End BigQuery testing")


  }
}
