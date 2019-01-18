package services

import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.parser.decode
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

case class VersionedS3Data[T](value: T, version: String)

object S3 extends StrictLogging {
  private val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def getFromJson[T : Decoder](bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,VersionedS3Data[T]]] = Future {
    try {
      val s3Object = s3Client.getObject(bucket, key)

      val version = s3Object.getObjectMetadata.getVersionId

      val stream = s3Object.getObjectContent
      val raw: String = scala.io.Source.fromInputStream(stream).mkString
      stream.close()

      decode[T](raw) match {
        case Right(value) => Right(VersionedS3Data(value, version))
        case Left(error) =>
          logger.error(s"Error decoding json from S3 ($bucket/$key): ${error.getMessage}", error)
          Left(s"Error decoding json from S3 ($bucket/$key): ${error.getMessage}")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $bucket/$key from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  def putAsJson[T: Encoder](bucket: String, key: String, data: VersionedS3Data[T])(implicit ec: ExecutionContext): Future[Either[String,Unit]] = Future {
    try {
      val currentVersion = s3Client.getObject(bucket, key).getObjectMetadata.getVersionId

      if (currentVersion == data.version) {
        s3Client.putObject(bucket, key, data.value.asJson.spaces2)
        Right[String, Unit] { () }
      } else {
        logger.warn(s"Cannot update S3 object $bucket/$key because provided version (${data.version}) does not match latest version ($currentVersion)")
        Left(s"Cannot update S3 object $bucket/$key because latest version does not match")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $bucket/$key to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}
