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
import models.promos.PromoCampaign
import services.promo.DynamoPromos
import controllers.promos.PromoCampaignsController.dynamoPromoCampaigns
import models.promos.Promo

class PromosController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoPromos: DynamoPromos
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

  def get(promoCode: String) = authAction.async { request =>
    run {
      dynamoPromos
        .getPromo(promoCode)
        .map(promo => Ok(noNulls(promo.asJson)))
    }
  }

  def create = authAction.async(circe.json[Promo]) { request =>
    run {
      val promo = request.body
      logger.info(s"${request.user.email} is creating '${promo.promoCode}'")
      dynamoPromos
        .createPromo(promo)
        .map(_ => Ok("created"))
        .catchSome { case DynamoDuplicateNameError(error) =>
          logger.warn(
            s"Failed to create '${promo.promoCode}' because code already exists: ${error.getMessage}"
          )
          ZIO.succeed(
            BadRequest(
              s"Cannot create promo '${promo.promoCode}' because it already exists. Please use a different code"
            )
          )
        }
    }
  }
}
