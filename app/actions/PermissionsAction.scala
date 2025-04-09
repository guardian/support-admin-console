package actions

import com.gu.googleauth.AuthAction
import com.gu.googleauth.AuthAction.UserIdentityRequest
import com.typesafe.scalalogging.LazyLogging
import play.api.mvc.{ActionBuilder, ActionFilter, AnyContent, PlayBodyParsers, Result, Results}
import services.DynamoPermissionsCache
import services.UserPermissions.Permission

import scala.concurrent.{ExecutionContext, Future}

case class AuthAndPermissionActions(
  read: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],  // ensures user has Read or Write permission
  write: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent]  // ensures user has Write permission
)

object AuthAndPermissionActions {
  def withPermissionsChecks(
    name: String,
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    permissionsService: DynamoPermissionsCache,
    parse: PlayBodyParsers,
    executionContext: ExecutionContext,
  ): AuthAndPermissionActions = AuthAndPermissionActions(
    read = authAction andThen
      new PermissionsAction(
        permissionsService,
        name,
        Permission.Read,
        parse,
        executionContext
      ),
    write = authAction andThen
      new PermissionsAction(
        permissionsService,
        name,
        Permission.Write,
        parse,
        executionContext
      ),
  )

  def withoutPermissionsChecks(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent]): AuthAndPermissionActions =
    AuthAndPermissionActions(authAction, authAction)
}

class PermissionsAction(
  permissionsService: DynamoPermissionsCache,
  page: String,
  requiredPermission: Permission,
  val parse: PlayBodyParsers,
  val executionContext: ExecutionContext,
) extends ActionFilter[UserIdentityRequest] with Results with LazyLogging {

  private def logAndForbid(message: String): Result = {
    logger.info(message)
    Forbidden(message)
  }

  // In the filter function we return None if the user has permission to access the resource,
  // otherwise we return a 403 Forbidden to the client
  override protected def filter[A](request: UserIdentityRequest[A]): Future[Option[Result]] = Future.successful {
    permissionsService.getPermissionsForUser(request.user.email) match {
      case Some(permissions) =>
        permissions.find(permission => permission.name == page) match {
          case Some(userPermission) =>
            userPermission.permission match {
              case Permission.Write => None // user has full access
              case Permission.Read =>
                if (requiredPermission != Permission.Write) None
                else Some(logAndForbid(s"Invalid permission for user, for page $page"))
            }
          case None => Some(logAndForbid(s"No permission found for user, for page $page"))
        }
      case None => Some(logAndForbid("No permissions found for user"))
    }
  }
}
