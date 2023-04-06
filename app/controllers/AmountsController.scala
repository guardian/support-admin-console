package controllers

import com.gu.googleauth.AuthAction
import models.AmountsTest
import models.AmountsTest._
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class AmountsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[AmountsTest](authAction, components, stage, filename = "configured-amounts-v2.json", runtime) {
}
