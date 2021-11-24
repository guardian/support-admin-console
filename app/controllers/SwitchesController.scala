package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.SupportFrontendSwitches.{SupportFrontendSwitches, SupportFrontendSwitchesDecoder, SupportFrontendSwitchesEncoder}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class SwitchesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends S3ObjectController[SupportFrontendSwitches](authAction, components, stage, filename = "switches.json", runtime) {
}
