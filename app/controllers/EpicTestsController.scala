package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.EpicTests
import models.EpicTests._

import scala.concurrent.ExecutionContext

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String)(implicit ec: ExecutionContext)
  extends LockableSettingsController[EpicTests](
    authAction,
    components,
    stage,
    dataBucket = "support-admin-console", //TODO - use a different bucket for public data
    dataFilename = "epic-tests.json",
    lockFilename = "epic-tests.lock") {
}
