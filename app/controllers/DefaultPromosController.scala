package controllers

import com.gu.googleauth.AuthAction
import models.{AppsMeteringSwitches, DefaultPromos}
import models.AppsMeteringSwitches._
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class DefaultPromosController(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[DefaultPromos](authAction, components, stage, filename = "default-promos.json", runtime) {
}
