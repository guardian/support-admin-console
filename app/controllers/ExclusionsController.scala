package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import io.circe.generic.auto._
import io.circe.syntax._
import models.ChannelExclusionSettings
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.S3Client.S3GetObjectError
import services.UserPermissions.Permission
import services.{DynamoPermissionsCache, S3Json, VersionedS3Data}
import software.amazon.awssdk.services.s3.model.NoSuchKeyException
import utils.Circe.noNulls
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
      authAction,
      components,
      stage,
      filename = "exclusions.json",
      runtime
    )
    with Circe {

  private val authAndPermissionActions = new AuthAndPermissionActions(
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
  )

  // Override set to require Write permission
  override def set = authAndPermissionActions.write.async(circe.json[VersionedS3Data[ChannelExclusionSettings]]) { request =>
    run {
      S3Json
        .updateAsJson(request.body)(s3Client)
        .apply(dataObjectSettings)
        .map(_ => Ok("updated"))
    }
  }

  override def get = authAndPermissionActions.read.async { request =>
    run {
      S3Json
        .getFromJson[ChannelExclusionSettings](s3Client)
        .apply(dataObjectSettings)
        .map(settings => Ok(settings.asJson.noSpaces))
        .catchSome {
          case S3GetObjectError(_: NoSuchKeyException) =>
            ZIO.succeed(Ok(noNulls(ChannelExclusionSettings().asJson)))
          case S3GetObjectError(error) if Option(error.getMessage).exists(_.contains("The specified key does not exist")) =>
            ZIO.succeed(Ok(noNulls(ChannelExclusionSettings().asJson)))
        }
    }
  }
}
