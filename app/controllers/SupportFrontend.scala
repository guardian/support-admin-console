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

case class VersionedSwitches(switches: SupportFrontendSettings, version: String)

case object VersionedSwitches {
  def fromS3(s3Data: VersionedS3Data): Either[io.circe.Error, VersionedSwitches] = {
    println(s3Data.value)

    decode[SupportFrontendSettings](s3Data.value).map { switches =>
      VersionedSwitches(switches, s3Data.version)
    }
  }

  def toS3(versionedSwitches: VersionedSwitches): VersionedS3Data =
    VersionedS3Data(versionedSwitches.asJson.spaces2, versionedSwitches.version)

  val form: Form[VersionedSwitches] = Form(
    mapping(
      "switches" -> SupportFrontendSwitches.supportFrontendSettingsMapping,
      "version" -> text
    )(VersionedSwitches.apply)(VersionedSwitches.unapply)
  )
}

class SupportFrontend(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends AbstractController(components) {

  private val bucket = "support-frontend-admin-console"
  private val switchesKey = s"$stage/settings.json"

  private implicit val messages = messagesApi.preferred(Seq(Lang.defaultLang))

  def getSwitches = authAction.async {
    S3.get(bucket, switchesKey).map {
      case Right(s3Data) =>
        VersionedSwitches.fromS3(s3Data) match {
          case Right(switches) =>
            val form = VersionedSwitches.form.fill(switches)
            Ok(views.html.switches(form))

          case Left(e) =>
            println(s"Error: $e")
            InternalServerError(e.getMessage)
        }
      case Left(error) => InternalServerError(error)
    }
  }


  def setSwitches = authAction.async { implicit request =>
    VersionedSwitches.form.bindFromRequest.fold(
      formWithErrors => {
        println(s"Errors: ${formWithErrors.errors}")
        Future.successful(BadRequest("error!"))
      },
      versionedSwitches => {
        S3.put(bucket, switchesKey, VersionedSwitches.toS3(versionedSwitches)).map {
          case Right(_) => Ok("")
          case Left(error) => InternalServerError(error)
        }
      }
    )
  }
}
