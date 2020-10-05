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
import zio.DefaultRuntime

class AppComponents(context: Context, stage: String) extends BuiltInComponentsFromContext(context) with AhcWSComponents with NoHttpFiltersComponents with AssetsComponents {

  private val authConfig = {
    val clientId = configuration.get[String]("googleAuth.clientId")
    val clientSecret = configuration.get[String]("googleAuth.clientSecret")
    val redirectUrl = configuration.get[String]("googleAuth.redirectUrl")
    val domain = configuration.get[String]("googleAuth.domain")

    //TODO - play secret rotation
    GoogleAuthConfig(clientId, clientSecret, redirectUrl, domain, antiForgeryChecker = AntiForgeryChecker.borrowSettingsFromPlay(httpConfiguration))
  }

  // https://github.com/guardian/play-googleauth#implement-googlegroups-based-access-control-using-the-directory-api
  private val googleGroupChecker = {
    val s3URI = new AmazonS3URI(configuration.get[String]("googleAuth.serviceAccount.certificateS3Path"))
    val stream = S3.s3Client
      .getObject(s3URI.getBucket, s3URI.getKey)
      .getObjectContent

    val googleServiceAccountCredential = GoogleCredential.fromStream(stream)
    stream.close()

    val serviceAccount = GoogleServiceAccount(
      googleServiceAccountCredential.getServiceAccountId,
      googleServiceAccountCredential.getServiceAccountPrivateKey,
      configuration.get[String]("googleAuth.serviceAccount.impersonatedUser"),
    )

    new GoogleGroupChecker(serviceAccount)
  }

  private val requiredGoogleGroups: Set[String] = configuration.get[String]("googleAuth.requiredGroups").split(',').toSet

  private val authAction = new AuthAction[AnyContent](authConfig, routes.Login.loginAction(), controllerComponents.parsers.default)(executionContext)

  private val runtime = new DefaultRuntime {}

  override lazy val router: Router = new Routes(
    httpErrorHandler,
    new Application(authAction, controllerComponents, stage),
    new Login(authConfig, wsClient, requiredGoogleGroups, googleGroupChecker, controllerComponents),
    new SwitchesController(authAction, controllerComponents, stage, runtime),
    new ContributionTypesController(authAction, controllerComponents, stage, runtime),
    new AmountsController(authAction, controllerComponents, stage, runtime),
    new EpicTestsController(authAction, controllerComponents, wsClient, stage, runtime),
    new EpicTestArchiveController(authAction, controllerComponents, wsClient, stage, runtime),
    new LiveblogEpicTestsController(authAction, controllerComponents, wsClient, stage, runtime),
    new LiveblogEpicTestArchiveController(authAction, controllerComponents, wsClient, stage, runtime),
    new BannerTestsController(authAction, controllerComponents, wsClient, stage, runtime),
    new BannerTestArchiveController(authAction, controllerComponents, wsClient, stage, runtime),
    new BannerTestsController2(authAction, controllerComponents, wsClient, stage, runtime),
    new BannerTestArchiveController2(authAction, controllerComponents, wsClient, stage, runtime),
    assets
  )
}
