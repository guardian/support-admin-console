package controllers.promos

import com.gu.googleauth.AuthAction
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoNoLockError}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, ActionBuilder, AnyContent, ControllerComponents, Result}
import scala.concurrent.ExecutionContext
import com.typesafe.scalalogging.LazyLogging
import services.promo.DynamoPromoCampaigns
import zio.ZIO
import scala.concurrent.Future
import zio.Unsafe
import utils.Circe.noNulls
import io.circe.syntax._
import io.circe.parser._
import models.promos.PromoProduct

class PromoCampaignsController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoPromoCampaigns: DynamoPromoCampaigns
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

  def get(campaignCode: String) = authAction.async { request =>
    run {
      dynamoPromoCampaigns
        .getPromoCampaign(campaignCode)
        .map(promoCampaign => Ok(noNulls(promoCampaign.asJson)))
    }
  }

  def getAll(product: String) = authAction.async { request =>
    run {
      ZIO
        .fromEither(decode[PromoProduct](product))
        .flatMap(promoProduct =>
          dynamoPromoCampaigns
            .getAllPromoCampaigns(promoProduct)
            .map { promoCampaigns =>
              Ok(noNulls(promoCampaigns.asJson))
            }
        )
    }
  }
}
