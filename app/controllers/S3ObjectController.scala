package controllers

import com.gu.googleauth.AuthAction
import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents, Result}
import services.S3Client.S3ObjectSettings
import services.{S3Json, VersionedS3Data}
import zio.blocking.Blocking
import zio.{DefaultRuntime, IO, ZIO}

import scala.concurrent.{ExecutionContext, Future}

/**
  * Controller for managing JSON data in a single object in S3
  */
abstract class S3ObjectController[T : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  filename: String,
  val runtime: DefaultRuntime)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {

  private val dataObjectSettings = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/$filename",
    publicRead = false,
    cacheControl = None
  )
  private val s3Client = services.S3

  private def run(f: => ZIO[Blocking, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll { error =>
        IO.succeed(InternalServerError(error.getMessage))
      }
    }

  /**
    * Returns current version of the object in s3 as json, with the version id.
    * The s3 data is validated against the model.
    */
  def get = authAction.async {
    run {
      S3Json
        .getFromJson[T](s3Client)
        .apply(dataObjectSettings)
        .map { s3Data =>
          Ok(S3Json.noNulls(s3Data.asJson))
        }
    }
  }

  /**
    * Updates the object in s3 if the supplied version matches the current version in s3.
    * The POSTed json is validated against the model.
    */
  def set = authAction.async(circe.json[VersionedS3Data[T]]) { request =>
    run {
      S3Json
        .updateAsJson(request.body)(s3Client)
        .apply(dataObjectSettings)
        .map(_ => Ok("updated"))
    }
  }
}
