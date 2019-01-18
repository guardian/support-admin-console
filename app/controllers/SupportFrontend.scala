package controllers

import com.gu.googleauth.AuthAction
import models._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3, VersionedS3Data}
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.ExecutionContext

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings.json"

  def getSwitches = authAction.async {
    S3.getFromJson[SupportFrontendSettings](bucket, switchesKey).map {
      case Right(s3Data) => Ok(s3Data.asJson.noSpaces)
      case Left(error) => InternalServerError(error)
    }
  }

  def setSwitches = authAction.async(circe.json[VersionedS3Data[SupportFrontendSettings]]) { request =>
    S3.putAsJson(bucket, switchesKey, request.body).map {
      case Right(_) => Ok("updated")
      case Left(error) => InternalServerError(error)
    }
  }
}
