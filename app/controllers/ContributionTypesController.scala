package controllers

import com.gu.googleauth.AuthAction
import models.ContributionTypes
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._
import zio.ZEnv

import scala.concurrent.ExecutionContext

class ContributionTypesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: zio.Runtime[ZEnv])(implicit ec: ExecutionContext)
  extends S3ObjectController[ContributionTypes](authAction, components, stage, filename = "contributionTypes.json", runtime) {
}
