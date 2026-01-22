package controllers.promos

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.DynamoErrors.DynamoDuplicateNameError
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
import services.DynamoPermissionsCache
import services.UserPermissions.Permission

class PromoCampaignsController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    dynamoPromoCampaigns: DynamoPromoCampaigns,
    permissionsService: DynamoPermissionsCache
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private val authActions = new AuthAndPermissionActions(
    authAction,
    // all users have read access
    readPermissionAction = None,
    // users must have write access to make changes
    writePermissionAction = Some(
      new PermissionAction(
        page = "promos-tool",
        requiredPermission = Permission.Write,
        permissionsService,
        components.parsers,
        ec
      )
    )
  )

  private def run(f: => ZIO[Any, Throwable, Result]): Future[Result] =
    Unsafe.unsafe { implicit unsafe =>
      runtime.unsafe.runToFuture {
        f.catchAll(error => {
          logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
          ZIO.succeed(InternalServerError(error.getMessage))
        })
      }
    }

  def get(campaignCode: String) = authActions.read.async { request =>
    run {
      dynamoPromoCampaigns
        .getPromoCampaign(campaignCode)
        .map(promoCampaign => Ok(noNulls(promoCampaign.asJson)))
    }
  }

  def getAll(product: String) = authActions.read.async { request =>
    run {
      ZIO
        .fromEither(decode[PromoProduct](product))
        .flatMap(promoProduct =>
          dynamoPromoCampaigns
            .getAllPromoCampaigns(promoProduct)
            .map(promoCampaigns => Ok(noNulls(promoCampaigns.asJson)))
        )
    }
  }

  def create = authActions.write.async(circe.json[PromoCampaign]) { request =>
    run {
      val promoCampaign = request.body
      logger.info(s"${request.user.email} is creating '${promoCampaign.campaignCode}'")
      dynamoPromoCampaigns
        .createPromoCampaign(promoCampaign)
        .map(_ => Ok("created"))
        .catchSome { case DynamoDuplicateNameError(error) =>
          logger.warn(
            s"Failed to create '${promoCampaign.campaignCode}' because name already exists: ${error.getMessage}"
          )
          ZIO.succeed(
            BadRequest(
              s"Cannot create promo campaign '${promoCampaign.campaignCode}' because it already exists. Please use a different name"
            )
          )
        }
    }
  }
}
