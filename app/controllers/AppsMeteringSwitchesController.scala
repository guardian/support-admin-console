package controllers

import com.gu.googleauth.AuthAction
import models.AppsMeteringSwitches
import models.AppsMeteringSwitches._
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class AppsMeteringSwitchesController(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[Any])(implicit ec: ExecutionContext)
  extends S3ObjectController[AppsMeteringSwitches](authAction, components, stage, filename = "apps-metering-switches.json", runtime) {
}
