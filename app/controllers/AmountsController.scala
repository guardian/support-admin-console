package controllers

import com.gu.googleauth.AuthAction
import models.AmountsRegions
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._

import scala.concurrent.ExecutionContext

class AmountsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[AmountsRegions](authAction, components, stage, filename = "amounts.json") {
}
