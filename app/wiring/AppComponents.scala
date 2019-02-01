package wiring

import com.amazonaws.services.s3.AmazonS3URI
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.gu.googleauth._
import play.api.routing.Router
import controllers._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.AnyContent
import play.api.{BuiltInComponentsFromContext, NoHttpFiltersComponents}
import router.Routes
import services.S3

class AppComponents(context: Context, stage: String) extends BuiltInComponentsFromContext(context) with AhcWSComponents with NoHttpFiltersComponents with AssetsComponents {

  private val authConfig = {
    val clientId = configuration.get[String]("googleAuth.clientId")
    val clientSecret = configuration.get[String]("googleAuth.clientSecret")
    val redirectUrl = configuration.get[String]("googleAuth.redirectUrl")
    val domain = configuration.get[String]("googleAuth.domain")

    //TODO - play secret rotation
    GoogleAuthConfig(clientId, clientSecret, redirectUrl, domain, antiForgeryChecker = AntiForgeryChecker.borrowSettingsFromPlay(httpConfiguration))
  }

  // To create googleServiceAccount
  private val googleServiceAccountCertificateS3Path = configuration.get[String]("googleAuth.serviceAccount.certificateS3Path")
  private val s3URI = new AmazonS3URI(googleServiceAccountCertificateS3Path)
  private val stream = S3.s3Client
    .getObject(s3URI.getBucket, s3URI.getKey)
    .getObjectContent
  private val googleServiceAccountCredential = GoogleCredential.fromStream(stream)
  stream.close()

  // To create googleGroupChecker
  private val googleServiceAccount = GoogleServiceAccount(
    googleServiceAccountCredential.getServiceAccountId,
    googleServiceAccountCredential.getServiceAccountPrivateKey,
    configuration.get[String]("googleAuth.serviceAccount.impersonatedUser"),
  )

  // These are the ones that actually get passed into controllers
  private val googleGroupChecker = new GoogleGroupChecker(googleServiceAccount)
  private val requiredGoogleGroups: Set[String] = configuration.get[String]("googleAuth.requiredGroups").split(',').toSet

  private val authAction = new AuthAction[AnyContent](authConfig, routes.Login.loginAction(), controllerComponents.parsers.default)(executionContext)

  override lazy val router: Router = new Routes(
    httpErrorHandler,
    new Application(authAction, controllerComponents),
    new Login(authConfig, wsClient, requiredGoogleGroups, googleGroupChecker, controllerComponents),
    new SupportFrontend(authAction, stage, controllerComponents),
    assets
  )
}
