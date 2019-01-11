package wiring

import com.gu.googleauth.{AntiForgeryChecker, AuthAction, GoogleAuthConfig}
import play.api.routing.Router
import controllers._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.AnyContent
import play.api.{BuiltInComponentsFromContext, NoHttpFiltersComponents}
import router.Routes

class AppComponents(context: Context) extends BuiltInComponentsFromContext(context) with AhcWSComponents with NoHttpFiltersComponents with AssetsComponents {

  private val authConfig = {
    val clientId = configuration.get[String]("googleAuth.clientId")
    val clientSecret = configuration.get[String]("googleAuth.clientSecret")
    val redirectUrl = configuration.get[String]("googleAuth.redirectUrl")
    val domain = configuration.get[String]("googleAuth.domain")

    //TODO - play secret rotation
    GoogleAuthConfig(clientId, clientSecret, redirectUrl, domain, antiForgeryChecker = AntiForgeryChecker.borrowSettingsFromPlay(httpConfiguration))
  }

  private val authAction = new AuthAction[AnyContent](authConfig, routes.Login.loginAction(), controllerComponents.parsers.default)(executionContext)

  override lazy val router: Router = new Routes(
    httpErrorHandler,
    new Application(authAction, controllerComponents),
    new Login(authConfig, wsClient, controllerComponents),
    assets
  )
}
