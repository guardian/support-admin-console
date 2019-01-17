package controllers

import com.gu.googleauth.AuthAction
import com.gu.googleauth.AuthAction.UserIdentityRequest
import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3, VersionedS3Json}

import scala.concurrent.ExecutionContext

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe with StrictLogging {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings.json"

  /**
    * Config is returned as JSON - so the model is only defined in the client code.
    * We rely on client-side validation and S3 versioning to prevent bad data being written to S3.
    */

  def getSwitches = authAction.async {
    S3.getJson(bucket, switchesKey).map {
      case Right(s3Data) => Ok(VersionedS3Json.toJson(s3Data))
      case Left(error) => InternalServerError(error)
    }
  }

  def setSwitches = authAction.async(circe.json[VersionedS3Json]) { request: UserIdentityRequest[VersionedS3Json] =>
    S3.putJson(bucket, switchesKey, request.body).map {
      case Right(_) => Ok("")
      case Left(error) => InternalServerError(error)
    }
  }
}
