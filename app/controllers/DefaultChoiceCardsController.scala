package controllers

import actions.{AuthAndPermissionActions, PermissionAction}
import com.gu.googleauth.AuthAction
import models.DefaultChoiceCardsSettings
import play.api.libs.circe.Circe
import play.api.mvc.{ActionBuilder, AnyContent, ControllerComponents}
import services.UserPermissions.Permission
import services.DynamoPermissionsCache
import services.S3Client.S3ObjectSettings
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

  override protected def settingsForSave(email: String): S3ObjectSettings =
    super.settingsForSave(email).copy(metadata = Map("last-edited-by" -> email))
}
