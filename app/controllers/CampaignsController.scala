package controllers

import com.gu.googleauth.AuthAction
import models.Campaigns._
import play.api.mvc.{Action, AnyContent, ControllerComponents}
import services.{DynamoCampaigns, DynamoChannelTests}
import utils.Circe.noNulls
import zio.{IO, ZEnv}
import io.circe.syntax._
import models.Campaign
import models.ChannelTest.channelTestEncoder
import services.DynamoChannelTests.DynamoDuplicateNameError

import scala.concurrent.ExecutionContext

class CampaignsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoChannelTests: DynamoChannelTests,
  dynamoCampaigns: DynamoCampaigns
)(implicit ec: ExecutionContext)
  extends S3ObjectController[Campaigns](authAction, components, stage, filename = "campaigns.json", runtime) {

  override def get(): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoCampaigns.getAllCampaigns()
        .map(campaigns => Ok(noNulls(campaigns.asJson)))
    }
  }

  def createCampaign: Action[Campaign] = authAction.async(circe.json[Campaign]) { request =>
    run {
      val campaign = request.body
      logger.info(s"${request.user.email} is creating campaign '${campaign.name}'")
      dynamoCampaigns
        .createCampaign(campaign)
        .map(_ => Ok("created"))
        .catchSome { case DynamoDuplicateNameError(error) =>
          logger.warn(s"Failed to create '${campaign.name}' because name already exists: ${error.getMessage}")
          IO.succeed(BadRequest(s"Cannot create campaign '${campaign.name}' because it already exists. Please use a different name"))
        }
    }
  }

  def getTests(campaignName: String): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoChannelTests.getAllTestsInCampaign(campaignName)
        .map(tests => Ok(noNulls(tests.asJson)))
    }
  }
}
