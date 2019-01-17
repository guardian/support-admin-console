package controllers

import com.gu.googleauth.AuthAction
import io.circe.{Decoder, Encoder}
import models._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{S3, VersionedS3Data}
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.parser._
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.Forms.mapping
import play.api.i18n.Lang

import scala.concurrent.{ExecutionContext, Future}

case class VersionedSettings(settings: SupportFrontendSettings, version: String)

case object VersionedSettings {
  def fromS3(s3Data: VersionedS3Data): Either[io.circe.Error, VersionedSettings] = {
    println(s3Data.value)

    decode[SupportFrontendSettings](s3Data.value).map { settings =>
      VersionedSettings(settings, s3Data.version)
    }
  }

  def toS3(versionedSettings: VersionedSettings): VersionedS3Data =
    VersionedS3Data(versionedSettings.settings.asJson.spaces2, versionedSettings.version)

  val form: Form[VersionedSettings] = Form(
    mapping(
      "switches" -> SupportFrontendSwitches.supportFrontendSettingsMapping,
      "version" -> text
    )(VersionedSwitches.apply)(VersionedSwitches.unapply)
  )
}

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) with Circe {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings.json"

  private implicit val messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getSwitches = authAction.async {
    S3.get(bucket, switchesKey).map {
      case Right(s3Data) =>
        VersionedSettings.fromS3(s3Data) match {
          case Right(settings) =>
            Ok(views.html.switches(settings))

          case Left(e) =>
            println(s"Error: $e")
            InternalServerError(e.getMessage)
        }
      case Left(error) => InternalServerError(error)
    }
  }


  def setSwitches = authAction.async { request =>
    println(s"body: ${request.body.asFormUrlEncoded}")
    request.body.asFormUrlEncoded.map(f => f)
    Future.successful(Ok(""))
//    S3.put(bucket, switchesKey, VersionedSettings.toS3(request.body)).map {
//      case Right(_) => Ok("")
//      case Left(error) => InternalServerError(error)
//    }
  }
}
