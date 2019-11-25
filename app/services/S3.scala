package services

import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets

import com.amazonaws.services.s3.model.{CannedAccessControlList, ObjectMetadata, PutObjectRequest}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder, Json, Printer}
import io.circe.parser.decode
import io.circe.syntax._
import services.S3Client._
import zio._
import zio.blocking.{Blocking, effectBlocking}

import scala.collection.JavaConverters._


case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get: S3Action[RawVersionedS3Data]
  def update(data: RawVersionedS3Data): S3Action[Unit]
  def createOrUpdate(data: String): S3Action[Unit]
  def listKeys: S3Action[List[String]]
}

object S3Client {
  type RawVersionedS3Data = VersionedS3Data[String]
  type S3Action[T] = S3ObjectSettings => ZIO[Blocking, S3ClientError,T]

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

  val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get: S3Action[RawVersionedS3Data] = { objectSettings =>
    val s3ObjectAndStream = for {
      s3Object <- ZManaged.fromAutoCloseable(effectBlocking(s3Client.getObject(objectSettings.bucket, objectSettings.key)))
      stream <- ZManaged.fromAutoCloseable(effectBlocking(s3Object.getObjectContent))
    } yield (s3Object, stream)

    s3ObjectAndStream.use { case (s3Object, stream) =>
      Task {
        VersionedS3Data(
          value = scala.io.Source.fromInputStream(stream).mkString,
          version = s3Object.getObjectMetadata.getVersionId
        )
      }
    }.mapError { e =>
      logger.error(s"Error reading $objectSettings from S3: ${e.getMessage}", e)
      S3GetObjectError(e)
    }
  }

  def update(data: RawVersionedS3Data): S3Action[Unit] = { objectSettings =>
    effectBlocking(s3Client.getObjectMetadata(objectSettings.bucket, objectSettings.key).getVersionId)
      .mapError(e => {
        logger.error(s"Error getting object metadata for $objectSettings: ${e.getMessage}", e)
        S3GetObjectError(e)
      })
      .flatMap(currentVersion => {
        if (currentVersion == data.version) {
          createOrUpdate(data.value)(objectSettings).map(_ => data)
        } else {
          logger.warn(s"Cannot update S3 object $objectSettings because provided version (${data.version}) does not match latest version ($currentVersion)")
          IO.fail(S3VersionMatchError)
        }
      })
  }

  def createOrUpdate(data: String): S3Action[Unit] = { objectSettings =>
    val bytes = data.getBytes(StandardCharsets.UTF_8)

    Task(new ByteArrayInputStream(bytes))
      .bracket(stream => UIO(stream.close()))
      .apply { stream =>

        UIO.effectTotal {
          val metadata = new ObjectMetadata()
          metadata.setContentLength(bytes.length)
          // https://docs.fastly.com/en/guides/how-caching-and-cdns-work#surrogate-headers
          objectSettings.cacheControl.foreach(metadata.setCacheControl)
          objectSettings.surrogateControl.foreach(cc => metadata.addUserMetadata("surrogate-control", cc))

          new PutObjectRequest(
            objectSettings.bucket,
            objectSettings.key,
            stream,
            metadata
          )
        }.flatMap { request =>
          effectBlocking {
            s3Client.putObject(
              if (objectSettings.publicRead) request.withCannedAcl(CannedAccessControlList.PublicRead)
              else request
            )
          }.unit
        }
      }
      .mapError { e =>
        logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
        S3PutObjectError(e)
      }
  }

  def listKeys: S3Action[List[String]] = { objectSettings =>
    effectBlocking {
      val result = s3Client.listObjects(objectSettings.bucket, objectSettings.key)
      result.getObjectSummaries.asScala.toList.map(_.getKey)
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

  private val printer = Printer.spaces2.copy(dropNullValues = true)
  def noNulls(json: Json): String = printer.pretty(json)

  def getFromJson[T : Decoder](s3: S3Client): S3ObjectSettings => ZIO[Blocking,Throwable,VersionedS3Data[T]] = { objectSettings =>
    s3.get(objectSettings).flatMap { raw =>
      IO(decode[T](raw.value))
        .absolve
        .map(decoded => raw.copy(value = decoded))
        .mapError { error =>
          logger.error(s"Error decoding json from S3 ($objectSettings): ${error.getMessage}", error)
          S3JsonError(objectSettings, error.asInstanceOf[io.circe.Error])
        }
    }
  }

  def updateAsJson[T: Encoder](data: VersionedS3Data[T])(s3: S3Client): S3Action[Unit] =
    s3.update(data.copy(value = noNulls(data.value.asJson)))

  def createOrUpdateAsJson[T: Encoder](data: T)(s3: S3Client): S3Action[Unit] =
    s3.createOrUpdate(noNulls(data.asJson))
}
