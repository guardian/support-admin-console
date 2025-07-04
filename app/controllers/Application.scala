package controllers

import com.gu.googleauth.AuthAction
import play.api.libs.json.Json
import play.api.mvc._
import services.DynamoPermissionsCache

class Application(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents,
    stage: String,
    permissionsService: DynamoPermissionsCache,
    sdcUrlOverride: Option[String]
) extends AbstractController(components) {
  def healthcheck = Action {
    Ok(Json.obj("status" -> "ok", "gitCommitId" -> app.BuildInfo.gitCommitId))
  }

  def index = authAction { request =>
    val permissions = permissionsService.getPermissionsForUser(request.user.email).getOrElse(Nil)
    Ok(views.html.index(stage, permissions, sdcUrlOverride))
      .withHeaders(CACHE_CONTROL -> "no-cache")
  }

  // Handler for endpoints with a resource name in the path. The client takes care of using the name
  def indexWithName(name: String) = index
  def indexWithNameAndChannel(name: String, channel: String) = index
}
