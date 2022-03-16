package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc._

class Application(authAction: AuthAction[AnyContent], components: ControllerComponents, stage: String) extends AbstractController(components) {
  def healthcheck = Action {
    Ok("healthy")
  }

  def index = authAction {
    val jsLocation = routes.Assets.versioned("build/app.bundle.js").toString
    Ok(views.html.index(stage, jsLocation)).withHeaders(CACHE_CONTROL -> "no-cache")
  }
}
