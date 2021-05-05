package controllers

import com.gu.googleauth.AuthAction
import models.ChannelSwitches
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class ChannelSwitchesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends S3ObjectController[ChannelSwitches](authAction, components, stage, filename = "channel-switches.json", runtime) {
}
