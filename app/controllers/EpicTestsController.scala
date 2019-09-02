package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.EpicTests
import models.EpicTests._

import scala.concurrent.ExecutionContext

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[EpicTests](authAction, components, stage, filename = "epic-tests.json") {
}
