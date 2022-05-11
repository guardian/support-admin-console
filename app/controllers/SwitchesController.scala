package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.SupportFrontendSwitches.{SupportFrontendSwitches, SupportFrontendSwitchesDecoder, SupportFrontendSwitchesEncoder}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class SwitchesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[SupportFrontendSwitches](authAction, components, stage, filename = "switches_v2.json", runtime) {
}
