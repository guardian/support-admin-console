package controllers

import com.gu.googleauth.AuthAction
import models.DefaultPromos
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}

import scala.concurrent.ExecutionContext

class DefaultPromosController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any]
)(implicit ec: ExecutionContext)
    extends S3ObjectController[DefaultPromos](
      authAction,
      components,
      stage,
      filename = "default-promos.json",
      runtime
    ) {}
