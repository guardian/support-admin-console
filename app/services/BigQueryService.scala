package services

import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.RetryOption
import com.google.cloud.bigquery.{
  BigQuery,
  BigQueryOptions,
  FieldValueList,
  JobInfo,
  QueryJobConfiguration,
  QueryParameterValue,
  TableResult
}
import com.typesafe.scalalogging.LazyLogging
import models.BigQueryResult
import zio.ZIO

import java.io.ByteArrayInputStream
import scala.jdk.CollectionConverters._
import zio.ZIO.attemptBlocking

case class BigQueryError(message: String) extends Throwable

class BigQueryService(bigQuery: BigQuery) extends LazyLogging {
  def runQuery(queryString: String, testName: String): ZIO[Any, BigQueryError, TableResult] =
    attemptBlocking {
      val queryConfig = QueryJobConfiguration
        .newBuilder(queryString)
        .setUseLegacySql(false)
        .addNamedParameter("testName", QueryParameterValue.string(testName))
        .build()

      var queryJob = bigQuery.create(JobInfo.of(queryConfig))

      queryJob = queryJob.waitFor(RetryOption.maxAttempts(0))

      Option(queryJob)

    }.flatMap {
      case None      => ZIO.fail(BigQueryError("Cannot create query job"))
      case Some(job) =>
        Option(job.getStatus.getError) match {
          case None =>
            ZIO.succeed(
              job.getQueryResults()
            )
          case Some(error) => ZIO.fail(BigQueryError("Cannot retrieve results"))
        }
    }.mapError(error => {
      logger.error(s"Error running query: $error")
      BigQueryError(error.toString)
    })

  def toBigQueryResult(row: FieldValueList): BigQueryResult = {
    val bigQueryResult = BigQueryResult(
      row.get("test_name").getStringValue,
      row.get("variant_name").getStringValue,
      row.get("component_type").getStringValue,
      row.get("ltv3").getDoubleValue
    )
    logger.debug(bigQueryResult.toString)
    bigQueryResult
  }

  def getBigQueryResult(result: TableResult): List[BigQueryResult] = {
    result.getValues.asScala.map(toBigQueryResult).toList
  }

  def getLTV3Data(testName: String, channel: String, stage: String): ZIO[Any, BigQueryError, List[BigQueryResult]] = {

    ZIO.fromEither(BigQueryService.buildQuery(channel)).flatMap { query =>
      logger.info(s"Running LTV3 query for test '$testName' on channel '$channel'")
      runQuery(query, testName).map(result => getBigQueryResult(result))
    }
  }
}

object BigQueryService {
  def buildQuery(channel: String): Either[BigQueryError, String] =
    channel match {
      case "Epic"    => Right(querySql("ACQUISITIONS_EPIC"))
      case "Banner1" => Right(querySql("ACQUISITIONS_ENGAGEMENT_BANNER"))
      case "Banner2" => Right(querySql("ACQUISITIONS_SUBSCRIPTIONS_BANNER"))
      case other     => Left(BigQueryError(s"Unsupported channel: $other"))
    }

  // channelInQuery is always one of the fixed values above; testName is supplied as a named query parameter
  private def querySql(channelInQuery: String): String =
    s"""SELECT
      ab.name AS test_name,
      ab.variant AS variant_name,
      component_type,
      SUM(acquisition_ltv_3_year) AS ltv3,
    FROM `datatech-platform-prod.reader_revenue.fact_holding_acquisition`
    CROSS JOIN UNNEST(ab_tests) AS ab
    WHERE  ab.name = @testName
    AND component_type ='$channelInQuery'
    GROUP BY 1,2,3
    """

  def apply(stage: String, jsonCredentials: String): BigQueryService = {
    val wifCredentialsConfig = GoogleCredentials.fromStream(
      new ByteArrayInputStream(jsonCredentials.getBytes())
    )

    val credentials = FixedCredentialsProvider.create(wifCredentialsConfig).getCredentials
    val projectId = s"datatech-platform-${stage.toLowerCase}"
    val bigQuery = BigQueryOptions
      .newBuilder()
      .setCredentials(credentials)
      .setProjectId(projectId)
      .build()
      .getService
    new BigQueryService(bigQuery)
  }
}
