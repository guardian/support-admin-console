package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc._

class Application(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String) extends AbstractController(components) {
  def healthcheck = Action {
    Ok("healthy")
  }

  def index = authAction {
    Ok(views.html.index(stage)).withHeaders(CACHE_CONTROL -> "no-cache")
  }
}
