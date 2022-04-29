package controllers

import com.gu.googleauth.{GoogleAuthConfig, GoogleGroupChecker, LoginSupport, UserIdentity}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.concurrent.ExecutionContext

class Login(
  val authConfig: GoogleAuthConfig,
  val wsClient: WSClient,
  requiredGoogleGroups: Set[String],
  googleGroupChecker: GoogleGroupChecker,
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
    processOauth2Callback(requiredGoogleGroups, googleGroupChecker)
  }

  def logout: Action[AnyContent] = Action { implicit request =>
    Redirect("/").withNewSession
  }

  def isValid: Action[AnyContent] = Action { implicit request =>
    UserIdentity.fromRequest(request).filter(_.isValid) match {
      case Some(_) => Ok("auth is valid")
      case None => new Status(419)
    }
  }

  override val failureRedirectTarget: Call = routes.Login.login

  override val defaultRedirectTarget: Call = routes.Application.index
}
