package services

import com.google.auth.Credentials
import com.google.auth.oauth2.ServiceAccountCredentials
import com.google.cloud.bigquery.{BigQuery, BigQueryOptions}

import java.io.{ByteArrayInputStream, InputStream}

object ServiceAccount {

  def bigQuery(credentials: Credentials, projectId: String): BigQuery =
     BigQueryOptions
      .newBuilder()
      .setCredentials(credentials)
      .setProjectId(projectId)
      .build()
      .getService


  def credentialsFromConfig(config: BigQueryConfig): Credentials =
    credentialsFromStream(new ByteArrayInputStream(config.bigQueryCredentials.toString.getBytes()))


  def credentialsFromStream(credentialsStream: InputStream): ServiceAccountCredentials = {
    import scala.jdk.CollectionConverters._
    val bigQueryScope = "https://www.googleapis.com/auth/bigquery"
    ServiceAccountCredentials
      .fromStream(credentialsStream)
      .toBuilder
      .setScopes(List(bigQueryScope).asJavaCollection)
      .build()
  }

}
