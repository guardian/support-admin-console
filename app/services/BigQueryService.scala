package services

import com.google.api.gax.core.FixedCredentialsProvider
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.RetryOption
import com.google.cloud.bigquery.{BigQuery, BigQueryError,JobInfo, QueryJobConfiguration, TableResult}
import com.typesafe.scalalogging.LazyLogging
import play.api.i18n.Lang.logger

import java.io.ByteArrayInputStream

class BigQueryService(bigQuery: BigQuery) extends LazyLogging {

  def runQuery(queryString: String): Either[BigQueryError, TableResult] = {

    val queryConfig = QueryJobConfiguration
      .newBuilder(queryString)
      .build()
    logger.info(s"Query: $queryString")
    logger.info(s"QueryConfig: $queryConfig")

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


}

object BigQueryService {

  def apply(stage: Stage, jsonCredentials: String): BigQueryService = {
    val wifCredentialsConfig = GoogleCredentials.fromStream(
      new ByteArrayInputStream(jsonCredentials.getBytes())
      )

    val credentials =  FixedCredentialsProvider.create(wifCredentialsConfig).getCredentials
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