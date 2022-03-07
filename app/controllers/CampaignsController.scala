package controllers

import com.gu.googleauth.AuthAction
import models.Campaigns._
import play.api.mvc.{AnyContent, ControllerComponents}
import zio.DefaultRuntime

import scala.concurrent.ExecutionContext

class CampaignsController(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String, runtime: DefaultRuntime)(implicit ec: ExecutionContext)
  extends S3ObjectController[Campaigns](authAction, components, stage, filename = "campaigns.json", runtime) {
}
