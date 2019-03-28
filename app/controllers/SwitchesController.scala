package controllers

import com.gu.googleauth.AuthAction
import models.SupportFrontendSwitches
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext

class SwitchesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[SupportFrontendSwitches](authAction, components, stage, filename = "switches.json") {
}
