package services

import java.io.ByteArrayInputStream
import java.nio.charset.StandardCharsets

import com.amazonaws.services.s3.model.{CannedAccessControlList, ObjectMetadata, PutObjectRequest}
import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder, Json, Printer}
import io.circe.parser.decode
import io.circe.syntax._
import services.S3Client.{S3IO, _}
import zio._

case class VersionedS3Data[T](value: T, version: String)

trait S3Client {
  def get: S3RawIO
  def put(data: RawVersionedS3Data): S3RawIO
}

object S3Client {
  type RawVersionedS3Data = VersionedS3Data[String]
  type S3IO[E,T] = ZIO[S3ObjectSettings, E, VersionedS3Data[T]]
  type S3RawIO = S3IO[S3ClientError,String]

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
}

object S3 extends S3Client with StrictLogging {

  val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get: S3RawIO = ZIO.accessM { objectSettings =>
    Task(s3Client.getObject(objectSettings.bucket, objectSettings.key))
      .bracket(s3Object => UIO(s3Object.close()))
      .apply { s3Object =>
        val version = s3Object.getObjectMetadata.getVersionId

        Task(s3Object.getObjectContent)
          .bracket(stream => UIO(stream.close()))
          .apply { stream =>
            IO.succeed(
              VersionedS3Data(
                value = scala.io.Source.fromInputStream(stream).mkString,
                version
              )
            )
          }
      }
      .mapError { e =>
        logger.error(s"Error reading $objectSettings from S3: ${e.getMessage}", e)
        S3GetObjectError(e)
      }
  }

  //TODO - use this below
  private def write(data: RawVersionedS3Data): S3RawIO = ZIO.accessM { objectSettings =>
    val bytes = data.value.getBytes(StandardCharsets.UTF_8)

    ZIO(new ByteArrayInputStream(bytes))
      .bracket(stream => UIO(stream.close()))
      .apply { stream =>
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

        s3Client.putObject(
          if (objectSettings.publicRead) request.withCannedAcl(CannedAccessControlList.PublicRead)
          else request
        )

        ZIO.succeed(data)
      }
      //TODO - what happens to this error?
      .mapError { e =>
        logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
        S3PutObjectError(e)
      }
  }

  def put(data: RawVersionedS3Data): S3RawIO = ZIO.accessM { objectSettings =>
    Task(s3Client.getObject(objectSettings.bucket, objectSettings.key))
      .bracket(s3Object => UIO(s3Object.close()))
      .apply { s3Object =>
        val currentVersion = s3Object.getObjectMetadata.getVersionId

        if (currentVersion == data.version) {
          val bytes = data.value.getBytes(StandardCharsets.UTF_8)

          Task(new ByteArrayInputStream(bytes))
            .bracket(stream => UIO(stream.close()))
            .apply { stream =>
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

              s3Client.putObject(
                if (objectSettings.publicRead) request.withCannedAcl(CannedAccessControlList.PublicRead)
                else request
              )

              IO.succeed(data)
            }
        } else {
          logger.warn(s"Cannot update S3 object $objectSettings because provided version (${data.version}) does not match latest version ($currentVersion)")

          // TODO - what happens to this error?
          IO.fail(S3VersionMatchError)
        }
      }
      .mapError { e =>
        logger.error(s"Error writing $objectSettings to S3: ${e.getMessage}", e)
        S3PutObjectError(e)
      }
  }
}

object S3Json extends StrictLogging {

  case class S3JsonError(objectSettings: S3ObjectSettings, error: io.circe.Error) extends Throwable {
    override def getMessage = s"Error decoding json from S3 ($objectSettings): ${error.getMessage}"
  }

  private val printer = Printer.spaces2.copy(dropNullValues = true)
  def noNulls(json: Json): String = printer.pretty(json)

  def getFromJson[T : Decoder](s3: S3Client): S3IO[Throwable, T] = ZIO.accessM { objectSettings =>
    s3.get.flatMap { raw =>
      ZIO(decode[T](raw.value))
        .absolve
        .map(decoded => raw.copy(value = decoded))
        .mapError { error =>
          logger.error(s"Error decoding json from S3 ($objectSettings): ${error.getMessage}", error)
          S3JsonError(objectSettings, error.asInstanceOf[io.circe.Error]) //TODO - how to get correct error type with absolve?
        }
    }
  }

  def putAsJson[T: Encoder](data: VersionedS3Data[T])(s3: S3Client): S3RawIO =
    s3.put(data.copy(value = noNulls(data.value.asJson)))
}
