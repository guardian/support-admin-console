package actions

import actions.PermissionAction.checkPermission
import com.gu.googleauth.AuthAction
import com.gu.googleauth.AuthAction.UserIdentityRequest
import com.typesafe.scalalogging.LazyLogging
import play.api.mvc.{ActionBuilder, ActionFilter, AnyContent, PlayBodyParsers, Result, Results}
import services.{DynamoPermissionsCache, UserPermissions}
import services.UserPermissions.Permission

import scala.concurrent.{ExecutionContext, Future}

/**
 * This class provides separate Actions for read and write endpoints.
 * Each will first perform a google auth check, then do the permissions check for the user.
 */
class AuthAndPermissionActions(
  authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
  readPermissionAction: Option[PermissionAction],
  writePermissionAction: Option[PermissionAction]
) {
  // for endpoints that read data
  val read = readPermissionAction match {
    case Some(readAction) => authAction andThen readAction
    case None => authAction
  }
  // for endpoints that write data
  val write = writePermissionAction match {
    case Some(writeAction) => authAction andThen writeAction
    case None => authAction
  }
}

object AuthAndPermissionActions {
  // Does google auth check but no permissions checks
  def withoutPermissionsChecks(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent]) =
    new AuthAndPermissionActions(authAction, None, None)
}

object PermissionAction extends Results with LazyLogging {
  private def logAndForbid(message: String): Result = {
    logger.info(message)
    Forbidden(message)
  }

  def checkPermission(
    email: String,
    page: String,
    requiredPermission: Permission,
    userPermissions: Option[List[UserPermissions.PagePermission]]
  ): Option[Result] = {
    userPermissions match {
      case Some(permissions) =>
        permissions.find(permission => permission.name == page) match {
          case Some(userPermission) =>
            userPermission.permission match {
              case Permission.Write => None // user has full access
              case Permission.Read =>
                if (requiredPermission != Permission.Write) None
                else Some(logAndForbid(s"Invalid permission for user ${email}, for page $page"))
            }
          case None => Some(logAndForbid(s"No permission found for user ${email}, for page $page"))
        }
      case None => Some(logAndForbid(s"No permissions found for user ${email}"))
    }
  }
}

class PermissionAction(
  page: String,
  requiredPermission: Permission,
  permissionsService: DynamoPermissionsCache,
  val parse: PlayBodyParsers,
  val executionContext: ExecutionContext,
) extends ActionFilter[UserIdentityRequest] with Results with LazyLogging {

  // In the filter function we return None if the user has permission to access the resource,
  // otherwise we return a 403 Forbidden to the client
  override protected def filter[A](request: UserIdentityRequest[A]): Future[Option[Result]] = Future.successful {
    checkPermission(
      request.user.email,
      page,
      requiredPermission,
      permissionsService.getPermissionsForUser(request.user.email)
    )
  }
}
