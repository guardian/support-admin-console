package controllers

import com.gu.googleauth.AuthAction
import models.ConfiguredAmounts
import models.ConfiguredAmounts._
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.ZEnv

import scala.concurrent.ExecutionContext

class AmountsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[ConfiguredAmounts](authAction, components, stage, filename = "configured-amounts.json", runtime) {
}
