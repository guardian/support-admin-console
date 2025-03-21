package services

import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.RetryOption
import com.google.cloud.bigquery.{BigQuery, BigQueryOptions, FieldValueList, JobInfo, QueryJobConfiguration, TableResult}
import com.typesafe.scalalogging.LazyLogging
import models.BigQueryResult
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

import java.io.ByteArrayInputStream
import scala.jdk.CollectionConverters._


case class BigQueryError(message: String) extends Throwable

class BigQueryService(bigQuery: BigQuery) extends LazyLogging {
  def buildQuery(testName: String, channel:String, stage: String): String = {

    val channelInQuery = channel match {
      case "Epic" => "ACQUISITIONS_EPIC"
      case "Banner1" =>"ACQUISITIONS_ENGAGEMENT_BANNER"
      case "Banner2" =>"ACQUISITIONS_SUBSCRIPTIONS_BANNER"
    }

    s"""SELECT
      ab.name AS test_name,
      ab.variant AS variant_name,
      component_type,
      SUM(acquisition_ltv_3_year) AS ltv3,
    FROM `datatech-platform-prod.reader_revenue.fact_holding_acquisition`
    CROSS JOIN UNNEST(ab_tests) AS ab
    WHERE  ab.name= '$testName'
    AND component_type ='$channelInQuery'
    GROUP BY 1,2,3
    """
  }

  def runQuery(queryString: String) : ZIO[ZEnv,  BigQueryError, TableResult] =
    effectBlocking {
      val queryConfig = QueryJobConfiguration
        .newBuilder(queryString)
        .setUseLegacySql(false)
        .build()

      var queryJob = bigQuery.create(JobInfo.of(queryConfig))

      queryJob = queryJob.waitFor(RetryOption.maxAttempts(0))

      Option(queryJob)

    }.flatMap{
        case None=> ZIO.fail( BigQueryError("Job no longer exists"))
        case Some(job) =>
          Option(job.getStatus.getError) match {
            case None => ZIO.succeed(
             job.getQueryResults()
            )
            case Some(error) => ZIO.fail( BigQueryError("Cannot retrieve results"))
          }
      }.mapError(error=>{
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
    logger.debug( bigQueryResult.toString)
    bigQueryResult
  }
   def getBigQueryResult(result: TableResult):List[BigQueryResult] = {
     result.getValues.asScala.map(toBigQueryResult).toList
   }

  def getLTV3Data(testName: String, channel: String, stage: String):ZIO[ZEnv,  BigQueryError, List[BigQueryResult]]= {

    val query = buildQuery(testName, channel, stage)
    logger.info(s"Query: $query");
    runQuery(query).map(result => getBigQueryResult(result))
  }
}

object BigQueryService {

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

  def apply(): BigQueryService = {
    import com.google.cloud.bigquery.BigQueryOptions
    val bigQuery = BigQueryOptions.getDefaultInstance.getService
    new BigQueryService(bigQuery)
  }
}