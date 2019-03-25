package controllers

import com.gu.googleauth.AuthAction
import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3Json, VersionedS3Data}

import scala.concurrent.ExecutionContext

abstract class SettingsController[T : Decoder : Encoder](authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, filename: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  private val bucket = "support-admin-console"
  private val key = s"$stage/$filename"
  private val s3Client = services.S3

  /**
    * Returns current version of the settings in s3 as json, with the version id.
    * The s3 data is validated against the model.
    */
  def get = authAction.async {
    S3Json.getFromJson[T](bucket, key)(s3Client).map {
      case Right(s3Data) => Ok(S3Json.noNulls(s3Data.asJson))
      case Left(error) => InternalServerError(error)
    }
  }

  /**
    * Updates the file in s3 if the supplied version matches the current version in s3.
    * The POSTed json is validated against the model.
    */
  def set = authAction.async(circe.json[VersionedS3Data[T]]) { request =>
    S3Json.putAsJson(bucket, key, request.body)(s3Client).map {
      case Right(_) => Ok("updated")
      case Left(error) => InternalServerError(error)
    }
  }
}
