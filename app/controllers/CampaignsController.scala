package controllers

import com.gu.googleauth.AuthAction
import models.Campaigns._
import play.api.mvc.{AnyContent, ControllerComponents}
import services.DynamoChannelTests
import utils.Circe.noNulls
import zio.ZEnv
import io.circe.syntax._
import models.ChannelTest.channelTestEncoder

import scala.concurrent.ExecutionContext

class CampaignsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamo: DynamoChannelTests
)(implicit ec: ExecutionContext)
  extends S3ObjectController[Campaigns](authAction, components, stage, filename = "campaigns.json", runtime) {

  def getTests(campaignName: String) = authAction.async { request =>
    run {
      dynamo.getAllTestsInCampaign(campaignName)
        .map(tests => Ok(noNulls(tests.asJson)))
    }
  }
}
