package controllers

import com.gu.googleauth.{AuthAction, GoogleGroupChecker}
import models._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3Json, VersionedS3Data}
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.ExecutionContext

class SupportFrontend(
  authAction: AuthAction[AnyContent],
  stage: String,
  components: ControllerComponents
)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  private val bucket = "support-admin-console"
  private val switchesKey = s"$stage/switches.json"

  private val s3Client = services.S3

  /**
    * Returns current version of the settings in s3 as json, with the version id.
    * The s3 data is validated against the model.
    */
  def getSwitches = authAction.async {
    S3Json.getFromJson[SupportFrontendSwitches](bucket, switchesKey)(s3Client).map {
      case Right(s3Data) => Ok(S3Json.noNulls(s3Data.asJson))
      case Left(error) => InternalServerError(error)
    }
  }

  /**
    * Updates the file in s3 if the supplied version matches the current version in s3.
    * The POSTed json is validated against the model.
    */
  def setSwitches = authAction.async(circe.json[VersionedS3Data[SupportFrontendSwitches]]) { request =>
    S3Json.putAsJson(bucket, switchesKey, request.body)(s3Client).map {
      case Right(_) => Ok("updated")
      case Left(error) => InternalServerError(error)
    }
  }
}
