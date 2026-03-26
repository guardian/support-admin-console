package controllers

import actions.AuthAndPermissionActions
import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, ControllerComponents, Result}
import services.S3Client.S3ObjectSettings
import services.{S3Json, VersionedS3Data}
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.{ExecutionContext, Future}

case class VersionedS3DataWithEmail[T](value: T, version: String, email: String)

/** Controller for managing JSON data in a single object in S3
  */
abstract class S3ObjectController[T: Decoder: Encoder](
    authActions: AuthAndPermissionActions,
    components: ControllerComponents,
    stage: String,
    filename: String,
    val runtime: zio.Runtime[Any]
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private val dataObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/$filename",
    publicRead = false,
    cacheControl = None
  )
  private val s3Client = services.S3

  // Subclasses can recover specific S3 get errors (for example missing key with defaults).
  protected def recoverGetFromS3Error: PartialFunction[Throwable, ZIO[Any, Throwable, VersionedS3Data[T]]] =
    PartialFunction.empty

  protected def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe =>
      runtime.unsafe.runToFuture {
        f.catchAll { error =>
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          ZIO.succeed(InternalServerError(error.getMessage))
        }
      }
    }

  /** Returns current version of the object in s3 as json, with the version id. The s3 data is validated against the
    * model.
    */
  def get = authActions.read.async { request =>
    run {
      S3Json
        .getFromJson[T](s3Client)
        .apply(dataObjectSettings)
        .catchSome(recoverGetFromS3Error)
        .map(s3Data => VersionedS3DataWithEmail(s3Data.value, s3Data.version, request.user.email))
        .map { s3Data =>
          Ok(noNulls(s3Data.asJson))
        }
    }
  }

  /** Updates the object in s3 if the supplied version matches the current version in s3. The POSTed json is validated
    * against the model.
    */
  def set = authActions.write.async(circe.json[VersionedS3Data[T]]) { request =>
    run {
      S3Json
        .updateAsJson(request.body)(s3Client)
        .apply(dataObjectSettings)
        .map(_ => Ok("updated"))
    }
  }
}
