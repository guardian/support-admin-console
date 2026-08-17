package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.DefaultChoiceCardsSettings
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.S3Client.S3GetObjectError
import services.UserPermissions.Permission
import services.{DynamoPermissionsCache, VersionedS3Data}
import software.amazon.awssdk.services.s3.model.NoSuchKeyException
import software.amazon.awssdk.services.s3.model.S3Exception
import zio.ZIO

import scala.concurrent.ExecutionContext

object DefaultChoiceCardsController {
  val name = "default-choice-cards"
}

class DefaultChoiceCardsController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    runtime: zio.Runtime[Any],
    permissionsService: DynamoPermissionsCache
)(implicit executionContext: ExecutionContext)
    extends S3ObjectController[DefaultChoiceCardsSettings](
      new AuthAndPermissionActions(
        authAction,
        // all users have read access
        readPermissionAction = None,
        // users must have write access to make changes
        writePermissionAction = Some(
          new PermissionAction(
            page = DefaultChoiceCardsController.name,
            requiredPermission = Permission.Write,
            permissionsService,
            components.parsers,
            executionContext
          )
        )
      ),
      components,
      stage,
      filename = "default-choice-cards-config.json",
      runtime
    )
    with Circe {

  override protected def addEditorMetadata(
      data: DefaultChoiceCardsSettings,
      email: String
  ): DefaultChoiceCardsSettings = data.copy(lastEditedBy = email)

  override protected def recoverGetFromS3Error
      : PartialFunction[Throwable, ZIO[Any, Throwable, VersionedS3Data[DefaultChoiceCardsSettings]]] = {
    case S3GetObjectError(_: NoSuchKeyException) =>
      ZIO.succeed(VersionedS3Data(DefaultChoiceCardsSettings.stub, ""))
    case S3GetObjectError(error) if Option(error.getMessage).exists(_.contains("The specified key does not exist")) =>
      ZIO.succeed(VersionedS3Data(DefaultChoiceCardsSettings.stub, ""))
    case S3GetObjectError(error: S3Exception)
        if error.statusCode() == 403 && Option(error.getMessage).exists(_.contains("s3:ListBucket")) =>
      ZIO.succeed(VersionedS3Data(DefaultChoiceCardsSettings.stub, ""))
  }
}
