package services

import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder, Json, Printer}
import io.circe.parser.decode
import io.circe.syntax._
import services.S3Client.RawVersionedS3Data

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get(bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
  def put(bucket: String, key: String, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
}

object S3Client {
  type RawVersionedS3Data = VersionedS3Data[String]
}

object S3 extends S3Client with StrictLogging {

  val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get(bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
    try {
      val s3Object = s3Client.getObject(bucket, key)

      val version = s3Object.getObjectMetadata.getVersionId

      val stream = s3Object.getObjectContent
      val raw: String = scala.io.Source.fromInputStream(stream).mkString
      stream.close()

      Right[String,RawVersionedS3Data](VersionedS3Data(raw, version))

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $bucket/$key from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  def put(bucket: String, key: String, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
    try {
      val currentVersion = s3Client.getObject(bucket, key).getObjectMetadata.getVersionId

      if (currentVersion == data.version) {
        println(s"putting:")
        println(data)
        s3Client.putObject(bucket, key, data.value)
        Right[String, RawVersionedS3Data](data)
      } else {
        logger.warn(s"Cannot update S3 object $bucket/$key because provided version (${data.version}) does not match latest version ($currentVersion)")
        Left(s"Can't save your settings because someone else has updated them since they were last fetched")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $bucket/$key to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}

object S3Json extends StrictLogging {

  private val printer = Printer.spaces2.copy(dropNullValues = true)
  def noNulls(json: Json): String = printer.pretty(json)

  def getFromJson[T : Decoder](bucket: String, key: String)(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,VersionedS3Data[T]]] =
    s3.get(bucket, key).map { result: Either[String, RawVersionedS3Data] =>
      result.flatMap { raw =>
        decode[T](raw.value) match {
          case Right(decoded) => Right(raw.copy(value = decoded))
          case Left(error) =>
            logger.error(s"Error decoding json from S3 ($bucket/$key): ${error.getMessage}", error)
            Left(s"Error decoding json from S3 ($bucket/$key): ${error.getMessage}")
        }
      }
    }

  def putAsJson[T: Encoder](bucket: String, key: String, data: VersionedS3Data[T])(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] =
    s3.put(
      bucket,
      key,
      data.copy(value = noNulls(data.value.asJson))
    )
}
