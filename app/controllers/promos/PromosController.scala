package controllers.promos

import actions.AuthAndPermissionActions
import com.typesafe.scalalogging.LazyLogging
import io.circe.parser._
import io.circe.syntax._
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoNoLockError}
import models.promos.Promo
import models.promos.PromoProduct
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents, Result}
import scala.concurrent.ExecutionContext
import scala.concurrent.Future
import services.promo.DynamoPromos
import utils.Circe.noNulls
import zio.Unsafe
import zio.ZIO

class PromosController(
    authActions: AuthAndPermissionActions,
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

  def get(promoCode: String) = authActions.read.async { request =>
    run {
      dynamoPromos
        .getPromo(promoCode)
        .map(promo => Ok(noNulls(promo.asJson)))
    }
  }

  def create = authActions.write.async(circe.json[Promo]) { request =>
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

  def lockPromo(promoCode: String) = authActions.write.async { request =>
    run {
      logger.info(s"${request.user.email} is locking promo '$promoCode'")
      dynamoPromos
        .lockPromo(promoCode, request.user.email, force = false)
        .map(_ => Ok("locked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(s"Failed to lock promo '$promoCode' because it is already locked: ${error.getMessage}")
          ZIO.succeed(
            Conflict(s"Promo '$promoCode' is already locked for edit by another user, or it doesn't exist")
          )
        }
    }
  }

  def unlockPromo(promoCode: String) = authActions.write.async { request =>
    run {
      logger.info(s"${request.user.email} is unlocking '$promoCode'")
      dynamoPromos
        .unlockPromo(promoCode, request.user.email)
        .map(_ => Ok("unlocked"))
        .catchSome { case DynamoNoLockError(error) =>
          logger.warn(
            s"Failed to unlock '$promoCode' because user ${request.user.email} does not have it locked: ${error.getMessage}"
          )
          ZIO.succeed(Conflict(s"You do not currently have promo '$promoCode' open for edit"))
        }
    }
  }

  def getAllPromos(campaignCode: String): Action[AnyContent] = authActions.read.async { request =>
    run {
      dynamoPromos
        .getAllPromos(campaignCode)
        .map(promos => Ok(noNulls(promos.asJson)))
    }
  }
}
