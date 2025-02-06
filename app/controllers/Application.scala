package controllers

import com.gu.googleauth.AuthAction
import play.api.libs.json.Json
import play.api.mvc._

class Application(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
                  components: ControllerComponents,
                  stage: String,
                  sdcUrlOverride: Option[String])
    extends AbstractController(components) {
  def healthcheck = Action {
    Ok(Json.obj("status" -> "ok", "gitCommitId" -> app.BuildInfo.gitCommitId))
  }


  def index = authAction {
    Ok(views.html.index(stage, sdcUrlOverride))
      .withHeaders(CACHE_CONTROL -> "no-cache")
  }

  // Handler for endpoints with a resource name in the path. The client takes care of using the name
  def indexWithName(name: String) = index
}
