package services

import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.RetryOption
import com.google.cloud.bigquery.{BigQuery, BigQueryError, FieldValue, FieldValueList, JobInfo, QueryJobConfiguration, TableResult}
import com.typesafe.scalalogging.LazyLogging
import models.BigQueryResult
import play.api.i18n.Lang.logger

import java.io.ByteArrayInputStream
import scala.jdk.CollectionConverters._


class BigQueryService(bigQuery: BigQuery) extends LazyLogging {

//TestQuery:     s"""SELECT * FROM `datatech-platform-prod.reader_revenue.fact_holding_acquisition` WHERE acquired_date >= "2025-03-11"  order by acquired_date  limit 5 """;

  def buildQuery(testName: String, channel:String, stage: String): String = {

    val channelInQuery = channel match {
      case "Epic" => "ACQUISITIONS_EPIC"
      case "Banner1" =>"ACQUISITIONS_ENGAGEMENT_BANNER"
      case "Banner2" =>"ACQUISITIONS_SUBSCRIPTIONS_BANNER"
    }

    s"""WITH ltv3dataForTest AS (SELECT
      ab.name AS test_name,
      ab.variant AS variant_name,
      component_type,
      SUM(acquisition_ltv_3_year) AS ltv3,
    FROM `datatech-platform-prod.reader_revenue.fact_holding_acquisition`
    CROSS JOIN UNNEST(ab_tests) AS ab
    WHERE  ab.name= '$testName'
    AND component_type ='$channelInQuery'
    GROUP BY 1,2,3
    )
    select test_name, variant_name,component_type,ltv3 from ltv3dataForTest
    """
  }
  def runQuery(queryString: String):Either[BigQueryError, TableResult] = {

    val queryConfig = QueryJobConfiguration
      .newBuilder(queryString)
      .setUseLegacySql(false)
      .build()

    var queryJob = bigQuery.create(JobInfo.of(queryConfig))

    queryJob = queryJob.waitFor(RetryOption.maxAttempts(0))

    Option(queryJob) match {
      case None =>
        val error = new BigQueryError("Job no longer exists", "BigQueryService", "Cannot retrieve results")
        logger.error(s"query failure: $error")
        Left(error)
      case Some(job) =>
        Option(job.getStatus.getError) match {
          case None =>
            logger.debug("query success")
            Right(job.getQueryResults())
          case Some(error) =>
            logger.error(s"query failure: $error")
            Left(error)
        }
    }
  }
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
    val totalRows= result.getTotalRows
    logger.info(s"Total Rows: $totalRows")
     result.getValues.asScala.map(toBigQueryResult).toList
   }


}

object BigQueryService {

  def apply(stage: Stage, jsonCredentials: String): BigQueryService = {

        val wifCredentialsConfig = GoogleCredentials.fromStream(
          new ByteArrayInputStream(jsonCredentials.getBytes())
          )

        val credentials = FixedCredentialsProvider.create(wifCredentialsConfig).getCredentials
        val projectId = s"datatech-platform-${stage.toString.toLowerCase}"
        val bigQuery = ServiceAccount.bigQuery(credentials, projectId)
        logger.info(s"BigQuery: $bigQuery");
        new BigQueryService(bigQuery)
  }



  /** Uses application default credentials for local testing
   * https://cloud.google.com/docs/authentication/application-default-credentials#personal
   */
  def apply(): BigQueryService = {
    import com.google.cloud.bigquery.BigQueryOptions
    val bigQuery = BigQueryOptions.getDefaultInstance.getService
    new BigQueryService(bigQuery)
  }
}