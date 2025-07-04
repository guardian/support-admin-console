package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import models.Campaign
import models.Campaigns._
import models.ChannelTest.channelTestEncoder
import models.DynamoErrors._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.{DynamoCampaigns, DynamoChannelTests}
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class CampaignsController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoChannelTests: DynamoChannelTests,
    dynamoCampaigns: DynamoCampaigns
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe =>
      runtime.unsafe.runToFuture {
        f.catchAll(error => {
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          ZIO.succeed(InternalServerError(error.getMessage))
        })
      }
    }

  def get(): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoCampaigns
        .getAllCampaigns()
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
          ZIO.succeed(
            BadRequest(
              s"Cannot create campaign '${campaign.name}' because it already exists. Please use a different name"
            )
          )
        }
    }
  }

  def updateCampaign: Action[Campaign] = authAction.async(circe.json[Campaign]) { request =>
    run {
      val campaign = request.body
      logger.info(s"${request.user.email} is updating campaign '${campaign.name}'")
      dynamoCampaigns
        .updateCampaign(campaign)
        .map(_ => Ok("updated"))
    }
  }

  def getTests(campaignName: String): Action[AnyContent] = authAction.async { request =>
    run {
      dynamoChannelTests
        .getAllTestsInCampaign(campaignName)
        .map(tests => Ok(noNulls(tests.asJson)))
    }
  }
}
