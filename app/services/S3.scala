package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.parser.decode
import io.circe.syntax._
import services.S3Client._
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.model.{GetObjectRequest, HeadObjectRequest, ListObjectsRequest, ObjectCannedACL, PutObjectRequest}
import zio._
import zio.blocking.effectBlocking
import software.amazon.awssdk.services.s3.{S3Client => AwsS3Client}
import utils.Circe.noNulls

import scala.jdk.CollectionConverters._


case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get: S3Action[RawVersionedS3Data]
  def update(data: RawVersionedS3Data): S3Action[Unit]
  def createOrUpdate(data: String): S3Action[Unit]
  def listKeys: S3Action[List[String]]
}

object S3Client {
  type RawVersionedS3Data = VersionedS3Data[String]
  type S3Action[T] = S3ObjectSettings => ZIO[ZEnv, S3ClientError,T]

  case class S3ObjectSettings(
    bucket: String,
    key: String,
    publicRead: Boolean,
    cacheControl: Option[String] = None,
    surrogateControl: Option[String] = None
  )

  sealed trait S3ClientError extends Throwable
  case class S3GetObjectError(error: Throwable) extends S3ClientError {
    override def getMessage = s"Error reading from S3: ${error.getMessage}"
  }
  case class S3PutObjectError(error: Throwable) extends S3ClientError {
    override def getMessage = s"Error writing to S3: ${error.getMessage}"
  }
  case object S3VersionMatchError extends S3ClientError {
    override def getMessage = "Can't save your settings because someone else has updated them since they were last fetched"
  }
  case class S3ListObjectsError(error: Throwable) extends S3ClientError {
    override def getMessage = s"Error getting object list from S3: ${error.getMessage}"
  }
}

object S3 extends S3Client with StrictLogging {

  val s3Client: AwsS3Client = AwsS3Client
    .builder
    .region(Aws.region)
    .credentialsProvider(Aws.credentialsProvider.build)
    .build

  def get: S3Action[RawVersionedS3Data] = { objectSettings =>
    val request = GetObjectRequest
      .builder
      .bucket(objectSettings.bucket)
      .key(objectSettings.key)
      .build

    ZManaged
      .fromAutoCloseable(effectBlocking(s3Client.getObject(request)))
      .use { s3Object =>
        Task {
          VersionedS3Data(
            value = scala.io.Source.fromInputStream(s3Object).mkString,
            version = s3Object.response().versionId()
          )
        }
      }
      .mapError { e =>
        logger.error(s"Error reading $objectSettings from S3: ${e.getMessage}", e)
        S3GetObjectError(e)
      }
  }

  def update(data: RawVersionedS3Data): S3Action[Unit] = { objectSettings =>
    val request = HeadObjectRequest
      .builder
      .bucket(objectSettings.bucket)
      .key(objectSettings.key)
      .build

    effectBlocking(s3Client.headObject(request))
      .mapError(e => {
        logger.error(s"Error getting object metadata for $objectSettings: ${e.getMessage}", e)
        S3GetObjectError(e)
      })
      .flatMap(response => {
        logger.info(s"Got object metadata for $objectSettings")
        if (response.versionId() == data.version) {
          createOrUpdate(data.value)(objectSettings)
        } else {
          logger.warn(s"Cannot update S3 object $objectSettings because provided version (${data.version}) does not match latest version (${response.versionId()})")
          IO.fail(S3VersionMatchError)
        }
      })
  }

  def createOrUpdate(data: String): S3Action[Unit] = { objectSettings =>
      UIO.effectTotal {
        val request = PutObjectRequest.builder
          .bucket(objectSettings.bucket)
          .key(objectSettings.key)

        val requestModifiers: List[Option[PutObjectRequest.Builder => PutObjectRequest.Builder]] = List(
          objectSettings.cacheControl.map(cc => _.cacheControl(cc)),
          objectSettings.surrogateControl.map(sc => _.metadata(Map("surrogate-control" -> sc).asJava)),
          if (objectSettings.publicRead) Some(_.acl(ObjectCannedACL.PUBLIC_READ)) else None
        )

        requestModifiers
          .flatten
          .foldLeft(request)((req, modifier) => modifier(req))
          .build()

      }.flatMap { request =>
        effectBlocking {
          s3Client.putObject(request, RequestBody.fromString(data))
        }.unit
      }
      .mapError { e =>
        logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
        S3PutObjectError(e)
      }
  }

  def listKeys: S3Action[List[String]] = { objectSettings =>
    effectBlocking {
      val request = ListObjectsRequest
        .builder
        .bucket(objectSettings.bucket)
        .prefix(objectSettings.key)
        .build

      val result = s3Client.listObjects(request)
      result.contents().asScala.toList.map(_.key)
    }.mapError { e =>
      logger.info(s"Error listing S3 objects for $objectSettings: ${e.getMessage}")
      S3ListObjectsError(e)
    }
  }
}

object S3Json extends StrictLogging {

  case class S3JsonError(objectSettings: S3ObjectSettings, error: io.circe.Error) extends Throwable {
    override def getMessage = s"Error decoding json from S3 ($objectSettings): ${error.getMessage}"
  }

  def getFromJson[T : Decoder](s3: S3Client): S3ObjectSettings => ZIO[ZEnv,Throwable,VersionedS3Data[T]] = { objectSettings =>
    s3.get(objectSettings).flatMap { raw =>

      IO.fromEither(decode[T](raw.value))
        .map(decoded => raw.copy(value = decoded))
        .mapError { error =>
          logger.error(s"Error decoding json from S3 ($objectSettings): ${error.getMessage}", error)
          S3JsonError(objectSettings, error)
        }
    }
  }

  def updateAsJson[T: Encoder](data: VersionedS3Data[T])(s3: S3Client): S3Action[Unit] =
    s3.update(data.copy(value = noNulls(data.value.asJson)))

  def createOrUpdateAsJson[T: Encoder](data: T)(s3: S3Client): S3Action[Unit] =
    s3.createOrUpdate(noNulls(data.asJson))
}
