package controllers

import com.gu.googleauth.AuthAction
import models._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3Json, VersionedS3Data}
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.ExecutionContext

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings.json"

  private val s3Client = services.S3

  def getSwitches = authAction.async {
    S3Json.getFromJson[SupportFrontendSettings](bucket, switchesKey)(s3Client).map {
      case Right(s3Data) => Ok(S3Json.noNulls(s3Data.asJson))
      case Left(error) => InternalServerError(error)
    }
  }

  def setSwitches = authAction.async(circe.json[VersionedS3Data[SupportFrontendSettings]]) { request =>
    S3Json.putAsJson(bucket, switchesKey, request.body)(s3Client).map {
      case Right(_) => Ok("updated")
      case Left(error) => InternalServerError(error)
    }
  }
}
