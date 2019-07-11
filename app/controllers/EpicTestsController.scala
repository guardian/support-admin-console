package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import io.circe.generic.auto._
import models.EpicTest

import scala.concurrent.ExecutionContext

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends SettingsController[List[EpicTest]](authAction, components, stage, filename = "epic-tests.json") {
}
