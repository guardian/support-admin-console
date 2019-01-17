package services

import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

case class VersionedS3Data(value: String, version: String)

object S3 extends StrictLogging {
  private val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get(bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,VersionedS3Data]] = Future {
    try {
      val s3Object = s3Client.getObject(bucket, key)

      val version = s3Object.getObjectMetadata.getVersionId
      println(s"version: $version")

      val stream = s3Object.getObjectContent
      val result = scala.io.Source.fromInputStream(stream).mkString
      stream.close()

      Right[String,VersionedS3Data](VersionedS3Data(result, version))

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $bucket/$key from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  def put(bucket: String, key: String, data: VersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,Unit]] = Future {
    try {
      val currentVersion = s3Client.getObject(bucket, key).getObjectMetadata.getVersionId

      if (currentVersion == data.version) {
        println(s"I would be sending:")
        println(data)
        //s3Client.putObject(bucket, key, data.value)
        Right[String, Unit] { () }
      } else {
        Left(s"Cannot update S3 object $bucket/$key because latest version does not match")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $bucket/$key to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}
