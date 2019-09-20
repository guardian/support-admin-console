package services

import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets

import com.amazonaws.services.s3.model.{CannedAccessControlList, ObjectMetadata, PutObjectRequest}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder, Json, Printer}
import io.circe.parser.decode
import io.circe.syntax._
import services.S3Client.{RawVersionedS3Data, S3ObjectSettings}

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
  def put(objectSettings: S3ObjectSettings, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
}

object S3Client {
  type RawVersionedS3Data = VersionedS3Data[String]

  case class S3ObjectSettings(
    bucket: String,
    key: String,
    publicRead: Boolean,
    cacheControl: Option[String] = None,
    surrogateControl: Option[String] = None
  )
}

object S3 extends S3Client with StrictLogging {

  val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
    try {
      val s3Object = s3Client.getObject(objectSettings.bucket, objectSettings.key)

      val version = s3Object.getObjectMetadata.getVersionId

      val stream = s3Object.getObjectContent
      val raw: String = scala.io.Source.fromInputStream(stream).mkString
      stream.close()

      Right[String,RawVersionedS3Data](VersionedS3Data(raw, version))

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $objectSettings from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  def put(objectSettings: S3ObjectSettings, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
    try {
      val currentVersion = s3Client.getObject(objectSettings.bucket, objectSettings.key).getObjectMetadata.getVersionId

      if (currentVersion == data.version) {

        val bytes = data.value.getBytes(StandardCharsets.UTF_8)
        val stream = new ByteArrayInputStream(bytes)

        val metadata = new ObjectMetadata()
        metadata.setContentLength(bytes.length)
        // https://docs.fastly.com/en/guides/how-caching-and-cdns-work#surrogate-headers
        objectSettings.cacheControl.foreach(metadata.setCacheControl)
        objectSettings.surrogateControl.foreach(cc => metadata.addUserMetadata("surrogate-control", cc))

        val request = new PutObjectRequest(
          objectSettings.bucket,
          objectSettings.key,
          stream,
          metadata
        )

        try {
          s3Client.putObject(
            if (objectSettings.publicRead) request.withCannedAcl(CannedAccessControlList.PublicRead)
            else request
          )
        } finally { // catch any exceptions higher up
          stream.close()
        }
        Right[String, RawVersionedS3Data](data)
      } else {
        logger.warn(s"Cannot update S3 object $objectSettings because provided version (${data.version}) does not match latest version ($currentVersion)")
        Left(s"Can't save your settings because someone else has updated them since they were last fetched")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}

object S3Json extends StrictLogging {

  private val printer = Printer.spaces2.copy(dropNullValues = true)
  def noNulls(json: Json): String = printer.pretty(json)

  def getFromJson[T : Decoder](objectSettings: S3ObjectSettings)(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,VersionedS3Data[T]]] =
    s3.get(objectSettings).map { result: Either[String, RawVersionedS3Data] =>
      result.flatMap { raw =>
        decode[T](raw.value) match {
          case Right(decoded) => Right(raw.copy(value = decoded))
          case Left(error) =>
            logger.error(s"Error decoding json from S3 ($objectSettings): ${error.getMessage}", error)
            Left(s"Error decoding json from S3 ($objectSettings): ${error.getMessage}")
        }
      }
    }

  def putAsJson[T: Encoder](objectSettings: S3ObjectSettings, data: VersionedS3Data[T])(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] =
    s3.put(
      objectSettings,
      data.copy(value = noNulls(data.value.asJson))
    )
}
