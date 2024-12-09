package controllers

import com.gu.googleauth.{GoogleAuthConfig, LoginSupport}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.ExecutionContext

class Login(
  val authConfig: GoogleAuthConfig,
  val wsClient: WSClient,
  requiredGoogleGroups: Set[String],
  components: ControllerComponents
)(implicit executionContext: ExecutionContext)
  extends AbstractController(components) with LoginSupport {

  /**
    * Shows UI for login button and logout error feedback
    */
  def login: Action[AnyContent] = Action { request =>
    val error = request.flash.get("error")
    Ok(views.html.login(error))
  }

  /*
   * Redirect to Google with anti forgery token (that we keep in session storage - note that flashing is NOT secure).
   */
  def loginAction: Action[AnyContent] = Action.async { implicit request =>
    startGoogleLogin()
  }

  /*
   * Looks up user's identity via Google
   */
  def oauth2Callback: Action[AnyContent] = Action.async { implicit request =>
    processOauth2Callback()
  }

  def logout: Action[AnyContent] = Action { implicit request =>
    Redirect("/").withNewSession
  }

  override val failureRedirectTarget: Call = routes.Login.login

  override val defaultRedirectTarget: Call = routes.Application.index
}
