package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import models.SupportFrontendSwitches.{SupportFrontendSwitches, SupportFrontendSwitchesDecoder, SupportFrontendSwitchesEncoder}

import scala.concurrent.ExecutionContext

class SwitchesController(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[Any])(implicit ec: ExecutionContext)
  extends S3ObjectController[SupportFrontendSwitches](authAction, components, stage, filename = "switches_v2.json", runtime) {
}
