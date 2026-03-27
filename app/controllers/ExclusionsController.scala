package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import io.circe.generic.auto._
import models.ChannelExclusionSettings
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.S3Client.S3GetObjectError
import services.UserPermissions.Permission
import services.{DynamoPermissionsCache, VersionedS3Data}
import software.amazon.awssdk.services.s3.model.NoSuchKeyException
import zio.ZIO

import scala.concurrent.ExecutionContext

object ExclusionsController {
  val name = "exclusions"
}

class ExclusionsController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends S3ObjectController[ChannelExclusionSettings](
      new AuthAndPermissionActions(
        authAction,
        // all users have read access
        readPermissionAction = None,
        // users must have write access to make changes
        writePermissionAction = Some(
          new PermissionAction(
            page = ExclusionsController.name,
            requiredPermission = Permission.Write,
            permissionsService,
            components.parsers,
            executionContext
          )
        )
      ),
      components,
      stage,
      filename = "exclusions.json",
      runtime
    )
    with Circe {

  override protected def recoverGetFromS3Error
      : PartialFunction[Throwable, ZIO[Any, Throwable, VersionedS3Data[ChannelExclusionSettings]]] = {
    case S3GetObjectError(_: NoSuchKeyException) =>
      ZIO.succeed(VersionedS3Data(ChannelExclusionSettings(), ""))
    case S3GetObjectError(error) if Option(error.getMessage).exists(_.contains("The specified key does not exist")) =>
      ZIO.succeed(VersionedS3Data(ChannelExclusionSettings(), ""))
  }
}
