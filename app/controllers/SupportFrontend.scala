package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.S3

import scala.concurrent.{ExecutionContext, Future}

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext) extends AbstractController(components) {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings-test.json"

  // Any type-checking and validation of the s3 data is done client-side

  def getSwitches = authAction.async {
    S3.get(bucket, switchesKey).map { switches: String =>
      Ok(switches)
    }
  }

  def setSwitches = authAction.async { request =>
    request.body.asText.map { body: String =>
      S3.put(bucket, switchesKey, body).map {
        case Right(_) => Ok()
        case Left(error) => InternalServerError(error)
      }
    } getOrElse Future.successful(BadRequest(""))
  }
}
