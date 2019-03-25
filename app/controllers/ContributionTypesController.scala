package controllers

import com.gu.googleauth.AuthAction
import models.ContributionTypes
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext

class ContributionTypesController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[ContributionTypes](authAction, components, stage, filename = "contributionTypes.json") {
}
