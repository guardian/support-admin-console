package services

import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Json, JsonObject}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

import io.circe.parser.parse

case class VersionedS3Json(value: Json, version: String)

object VersionedS3Json {
  def toJson(versionedS3Data: VersionedS3Json): Json = Json.fromJsonObject {
    JsonObject(
      "version" -> Json.fromString(versionedS3Data.version),
      "value" -> versionedS3Data.value
    )
  }
}

object S3 extends StrictLogging {
  private val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def getJson(bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,VersionedS3Json]] = Future {
    try {
      val s3Object = s3Client.getObject(bucket, key)

      val version = s3Object.getObjectMetadata.getVersionId

      val stream = s3Object.getObjectContent
      val result = scala.io.Source.fromInputStream(stream).mkString
      stream.close()

      parse(result) match {
        case Right(json) => Right[String,VersionedS3Json](VersionedS3Json(json, version))
        case Left(error) =>
          logger.error(s"Error parsing s3 data ($bucket/$key): ${error.getMessage}", error)
          Left(s"Error parsing s3 data ($bucket/$key): ${error.getMessage}")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $bucket/$key from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  def putJson(bucket: String, key: String, data: VersionedS3Json)(implicit ec: ExecutionContext): Future[Either[String,Unit]] = Future {
    try {
      val currentVersion = s3Client.getObject(bucket, key).getObjectMetadata.getVersionId

      if (currentVersion == data.version) {
        println(s"I would be sending: $data")
        //s3Client.putObject(bucket, key, data.value)
        Right[String, Unit] { () }
      } else {
        logger.warn(s"Cannot update S3 object $bucket/$key because latest version (${data.version}) does not match current version ($currentVersion)")
        Left(s"Cannot update S3 object $bucket/$key because latest version does not match")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $bucket/$key to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}
