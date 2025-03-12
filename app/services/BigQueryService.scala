package services

import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.RetryOption
import com.google.cloud.bigquery.{BigQuery, BigQueryError, FieldValue, FieldValueList, JobInfo, QueryJobConfiguration, TableResult}
import com.typesafe.scalalogging.LazyLogging
import models.BigQueryResult
import play.api.i18n.Lang.logger
import zio.{ZEnv, ZIO}

import java.io.ByteArrayInputStream
import java.time.LocalDate
import scala.jdk.CollectionConverters._


class BigQueryService(bigQuery: BigQuery) extends LazyLogging {


  def buildQuery(testName: String, channel:String, stage: String): String = {
     s"""SELECT * FROM `datatech-platform-prod.reader_revenue.fact_holding_acquisition` WHERE acquired_date >= "2025-03-11"  order by acquired_date  limit 5 """;
  }
  def runQuery(queryString: String,projectId: String):Either[BigQueryError, TableResult] = {

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

  def getDateValue(fieldValue: FieldValue)   = {
    LocalDate.parse(fieldValue.getStringValue)
  }
  def toBigQueryResult(row: FieldValueList): BigQueryResult = {
    val bigQueryResult = BigQueryResult(
      getDateValue(row.get("acquired_date")),
      row.get("acquisition_type").getStringValue,
      row.get("acquisition_ltv_3_year").getDoubleValue
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