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
import scala.collection.JavaConverters._

case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
  def update(objectSettings: S3ObjectSettings, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]]
  def create(objectSettings: S3ObjectSettings, data: String)(implicit ec: ExecutionContext): Future[Either[String,String]]
  def listKeys(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String, List[String]]]
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
      val raw: String = try {
        scala.io.Source.fromInputStream(stream).mkString
      } finally {
        stream.close()
        s3Object.close()
      }

      Right[String,RawVersionedS3Data](VersionedS3Data(raw, version))

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error reading $objectSettings from S3: ${e.getMessage}", e)
        Left(s"Error reading from S3: ${e.getMessage}")
    }
  }

  private def put(objectSettings: S3ObjectSettings, data: String)(implicit ec: ExecutionContext): Either[String,Unit] = {
    val bytes = data.getBytes(StandardCharsets.UTF_8)
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
    } catch { case NonFatal(e) =>
      logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
    } finally {
      stream.close()
    }
    Right(())
  }

  def update(objectSettings: S3ObjectSettings, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
    try {
      val currentVersion = s3Client.getObjectMetadata(objectSettings.bucket, objectSettings.key).getVersionId

      if (currentVersion == data.version) {
        put(objectSettings, data.value).map(_ => data)
      } else {
        logger.warn(s"Cannot update S3 object $objectSettings because provided version (${data.version}) does not match latest version ($currentVersion)")
        Left(s"Can't save your settings because someone else has updated them since they were last fetched")
      }

    } catch {
      case NonFatal(e) =>
        logger.error(s"Error updating $objectSettings in S3: ${e.getMessage}", e)
        Left(s"Error updating in S3: ${e.getMessage}")
    }
  }

  def create(objectSettings: S3ObjectSettings, data: String)(implicit ec: ExecutionContext): Future[Either[String,String]] =
    Future(put(objectSettings, data).map(_ => data))

  def listKeys(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String, List[String]]] = {
    Future {
      val result = s3Client.listObjects(objectSettings.bucket, objectSettings.key)
      Right[String, List[String]](result.getObjectSummaries.asScala.toList.map(_.getKey))
    }.recover {
      case NonFatal(e) => Left(s"Error listing S3 objects for $objectSettings: ${e.getMessage}")
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

  def updateAsJson[T: Encoder](objectSettings: S3ObjectSettings, data: VersionedS3Data[T])(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] =
    s3.update(
      objectSettings,
      data.copy(value = noNulls(data.value.asJson))
    )

  def createAsJson[T: Encoder](objectSettings: S3ObjectSettings, data: T)(s3: S3Client)(implicit ec: ExecutionContext): Future[Either[String,String]] =
    s3.create(
      objectSettings,
      noNulls(data.asJson)
    )
}
