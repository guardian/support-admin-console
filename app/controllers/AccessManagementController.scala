package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.syntax._
import play.api.libs.circe.Circe
import play.api.mvc._
import services.DynamoPermissionsCache
import services.UserPermissions.{Permission, UserPermissions}
import utils.Circe.noNulls
import zio.{Unsafe, ZIO}

import scala.concurrent.{ExecutionContext, Future}

object AccessManagementController {
  val name = "access-management"
}

class AccessManagementController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    permissionsService: DynamoPermissionsCache
)(implicit ec: ExecutionContext)
    extends AbstractController(components)
    with Circe
    with LazyLogging {

  private val authAndPermissionActions = new AuthAndPermissionActions(
    authAction,
    // all users have read access
    readPermissionAction = None,
    // users must have write access to update permissions
    writePermissionAction = Some(
      new PermissionAction(
        page = AccessManagementController.name,
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

  def getUsers(): Action[AnyContent] = authAndPermissionActions.read.async { request =>
    run {
      permissionsService
        .getAllUsers()
        .map(users => Ok(noNulls(users.asJson)))
    }
  }

  def updateUser(): Action[UserPermissions] = authAndPermissionActions.write.async(circe.json[UserPermissions]) {
    request =>
      val user = request.body
      run {
        permissionsService
          .upsertUser(user)
          .map(_ => Ok(noNulls(user.asJson)))
      }
  }
}
