package wiring

import com.google.auth.oauth2.ServiceAccountCredentials
import com.gu.googleauth._
import play.api.routing.Router
import controllers._
import controllers.banner._
import controllers.epic._
import play.api.ApplicationLoader.Context
import play.api.libs.ws.ahc.AhcWSComponents
import play.api.mvc.AnyContent
import play.api.{BuiltInComponentsFromContext, NoHttpFiltersComponents}
import router.Routes
import services.{Aws, CapiService, DynamoChannelTests, S3}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.s3.model.GetObjectRequest

class AppComponents(context: Context, stage: String) extends BuiltInComponentsFromContext(context) with AhcWSComponents with NoHttpFiltersComponents with AssetsComponents {

  private val authConfig = {
    val clientId = configuration.get[String]("googleAuth.clientId")
    val clientSecret = configuration.get[String]("googleAuth.clientSecret")
    val redirectUrl = configuration.get[String]("googleAuth.redirectUrl")
    val domain = configuration.get[String]("googleAuth.domain")

    //TODO - play secret rotation
    GoogleAuthConfig(clientId, clientSecret, redirectUrl, List(domain), antiForgeryChecker = AntiForgeryChecker.borrowSettingsFromPlay(httpConfiguration))
  }

  // https://github.com/guardian/play-googleauth#implement-googlegroups-based-access-control-using-the-directory-api
  private val googleGroupChecker = {
    val request = GetObjectRequest
      .builder()
      .bucket("support-admin-console")
      .key("google-auth-service-account-certificate.json")
      .build()
    val stream = S3.s3Client
      .getObject(request)

    val googleServiceAccountCredential = ServiceAccountCredentials.fromStream(stream)
    stream.close()

    val impersonatedUser = configuration.get[String]("googleAuth.serviceAccount.impersonatedUser")

    new GoogleGroupChecker(
      impersonatedUser,
      googleServiceAccountCredential
    )
  }

  private val requiredGoogleGroups: Set[String] = configuration.get[String]("googleAuth.requiredGroups").split(',').toSet

  private val authAction = new AuthAction[AnyContent](authConfig, controllers.routes.Login.loginAction, controllerComponents.parsers.default)(executionContext)

  private val runtime = zio.Runtime.default

  val capiService = new CapiService(configuration.get[String]("capi.apiKey"), wsClient)

  val dynamoClient = DynamoDbClient
    .builder
    .region(Aws.region)
    .credentialsProvider(Aws.credentialsProvider.build)
    .build

  val dynamoTestsService = new DynamoChannelTests(stage, dynamoClient)

  override lazy val router: Router = new Routes(
    httpErrorHandler,
    new Application(authAction, controllerComponents, stage),
    new Login(authConfig, wsClient, requiredGoogleGroups, googleGroupChecker, controllerComponents),
    new SwitchesController(authAction, controllerComponents, stage, runtime),
    new ContributionTypesController(authAction, controllerComponents, stage, runtime),
    new AmountsController(authAction, controllerComponents, stage, runtime),
    new EpicTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new HeaderTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new EpicHoldbackTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new LiveblogEpicTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new AppleNewsEpicTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new AMPEpicTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new BannerTestsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new BannerTestsController2(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new BannerDeployController(authAction, controllerComponents, stage, runtime),
    new BannerDeployController2(authAction, controllerComponents, stage, runtime),
    new ChannelSwitchesController(authAction, controllerComponents, stage, runtime),
    new CampaignsController(authAction, controllerComponents, stage, runtime, dynamoTestsService),
    new CapiController(authAction, capiService),
    new AppsMeteringSwitchesController(authAction, controllerComponents, stage, runtime),
    assets
  )
}
