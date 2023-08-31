package controllers

import com.gu.googleauth.AuthAction
import models.AmountsTests
import models.AmountsTests._
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class AmountsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[AmountsTests](authAction, components, stage, filename = "configured-amounts-v3.json", runtime) {
}
