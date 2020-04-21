package controllers

import com.gu.googleauth.AuthAction
import models.SupportFrontendSwitches
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class SwitchesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends SettingsController[SupportFrontendSwitches](authAction, components, stage, filename = "switches.json", runtime) {
}
