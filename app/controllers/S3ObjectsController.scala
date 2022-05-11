package controllers

import com.gu.googleauth.AuthAction
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.S3Client.S3ObjectSettings
import services.{S3Json, VersionedS3Data}
import zio.blocking.Blocking
import zio.{IO, ZEnv, ZIO}
import S3ObjectsController.extractFilename

import scala.concurrent.{ExecutionContext, Future}

object S3ObjectsController {
  // For extracting the json file name (without the extension) from an S3 key
  private val jsonFilenamePattern = """^.*/([\w-].*)\.json$""".r

  def extractFilename(key: String): Option[String] = key match {
    case jsonFilenamePattern(filename) => Some(filename)
    case _ => None
  }
}

/**
  * Controller for managing JSON data in objects under a specific S3 path:
  * `$stage/$path/$name.json`
  */
abstract class S3ObjectsController[T : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  path: String,
  nameGenerator: T => String,
  runtime: zio.Runtime[ZEnv]
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {

  val s3Client = services.S3

  private def run(f: => ZIO[Blocking, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll { error =>
        IO.succeed(InternalServerError(error.getMessage))
      }
    }

  private def buildObjectSettings(name: String) = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/$path/$name",
    publicRead = false
  )

  /**
    * Saves a single object of type T to a new file.
    * Overwrites any existing object of the same name.
    */
  def set = authAction.async(circe.json[T]) { request =>
    val data = request.body

    val objectSettings = buildObjectSettings(nameGenerator(data))

    run {
      S3Json
        .createOrUpdateAsJson(data)(s3Client)
        .apply(objectSettings)
        .map(_ => Ok("saved"))
        .mapError { error =>
          logger.error(s"Failed to save to ${objectSettings.key}: $data. Error was: $error")
          error
        }
    }
  }

  /**
    * Fetches all object keys from S3 and returns just the names
    */
  def list = authAction.async { request =>
    val objectSettings = buildObjectSettings("")  //empty string means list all files

    run {
      s3Client
        .listKeys(objectSettings)
        .map { keys =>
          val names: List[String] = keys.flatMap(extractFilename)
          Ok(S3Json.noNulls(names.asJson))
        }
        .mapError { error =>
          logger.error(s"Failed to fetch list of object names: $error")
          error
        }
    }
  }

  /**
    * Returns the object data for the given name
    */
  def get(name: String) = authAction.async { request =>
    val objectSettings = buildObjectSettings(name)

    run {
      S3Json
        .getFromJson[T](s3Client)
        .apply(objectSettings)
        .map { case VersionedS3Data(data, _) => Ok(data.asJson) }
        .mapError { error =>
          logger.error(s"Failed to get object ${objectSettings.key}: $error")
          error
        }
    }
  }
}
