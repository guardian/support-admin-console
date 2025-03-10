package services

import com.google.auth.Credentials
import com.google.auth.oauth2.GoogleCredentials
import com.google.cloud.bigquery.{BigQuery, BigQueryOptions}
import com.typesafe.scalalogging.LazyLogging
import services.Stage

import java.io.ByteArrayInputStream

class BigQueryService(stage: Stage, credentials: Credentials) extends LazyLogging {
  private val projectId = s"datatech-platform-${stage.toString.toLowerCase}"
  val bigQuery: BigQuery = {
    BigQueryOptions
      .newBuilder()
      .setCredentials(credentials)
      .setProjectId(projectId)
      .setLocation("EU-WEST-1")
      .build()
      .getService
  }

}

object BigQueryService {

  def build(stage: Stage, jsonCredentials: String): BigQueryService =
    new BigQueryService(
      stage,
      GoogleCredentials.fromStream(new ByteArrayInputStream(jsonCredentials.getBytes())),
      )
}