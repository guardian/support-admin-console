package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.ProductCatalogCache
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}

import scala.concurrent.{ExecutionContext, Future}

class ProductCatalogController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    runtime: zio.Runtime[Any],
    productCatalogCache: ProductCatalogCache
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe =>
      runtime.unsafe.runToFuture {
        f.catchAll { error =>
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          ZIO.succeed(InternalServerError(error.getMessage))
        }
      }
    }

  def getProductDetails(product: String): Action[AnyContent] = authAction.async { request =>
    run {
      ZIO.succeed(productCatalogCache.getCatalog).flatMap {
        case Some(catalog) =>
          product match {
            case "GuardianWeeklyDomestic" =>
              ZIO.succeed(Ok(noNulls(catalog.GuardianWeeklyDomestic.asJson)))
            case "GuardianWeeklyRestOfWorld" =>
              ZIO.succeed(Ok(noNulls(catalog.GuardianWeeklyRestOfWorld.asJson)))
            case "HomeDelivery" =>
              ZIO.succeed(Ok(noNulls(catalog.HomeDelivery.asJson)))
            case "SubscriptionCard" =>
              ZIO.succeed(Ok(noNulls(catalog.SubscriptionCard.asJson)))
            case "NationalDelivery" =>
              ZIO.succeed(Ok(noNulls(catalog.NationalDelivery.asJson)))
            case "SupporterPlus" =>
              ZIO.succeed(Ok(noNulls(catalog.SupporterPlus.asJson)))
            case "TierThree" =>
              ZIO.succeed(Ok(noNulls(catalog.TierThree.asJson)))
            case "DigitalSubscription" =>
              ZIO.succeed(Ok(noNulls(catalog.DigitalSubscription.asJson)))
            case _ =>
              ZIO.succeed(NotFound(s"Product '$product' not found in catalog"))
          }
        case None =>
          ZIO.succeed(ServiceUnavailable("Product catalog is not available"))
      }
    }
  }
}
