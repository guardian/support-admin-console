package controllers

import com.gu.googleauth.AuthAction
import models.ChannelSwitches
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class ChannelSwitchesController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any]
)(implicit ec: ExecutionContext)
    extends S3ObjectController[ChannelSwitches](
      authAction,
      components,
      stage,
      filename = "channel-switches.json",
      runtime
    ) {}
