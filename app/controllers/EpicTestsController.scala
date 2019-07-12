package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.EpicTest
import models.EpicTest._

import scala.concurrent.ExecutionContext

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[List[EpicTest]](authAction, components, stage, filename = "epic-tests.json") {
}
