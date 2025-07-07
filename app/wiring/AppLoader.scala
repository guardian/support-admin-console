package wiring

import java.io.File
import com.typesafe.scalalogging.StrictLogging
import play.api.ApplicationLoader.Context
import play.api._
import play.api.libs.logback.LogbackLoggerConfigurator
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}
import services.Aws

import scala.util.{Failure, Success, Try}

class AppLoader extends ApplicationLoader with StrictLogging {

  override def load(context: Context): Application = {
    new LogbackLoggerConfigurator().configure(context.environment)

    def addConfigToContext(identity: AppIdentity): Try[Context] = Try {
      val loadedConfig = ConfigurationLoader.load(identity) {
        case AwsIdentity(app, stack, stage, _) => SSMConfigurationLocation(s"/$app/$stage", Aws.region.id())
        case DevIdentity(app)                  =>
          FileConfigurationLocation(
            new File(s"/etc/gu/support-admin-console.private.conf")
          ) // assume conf is available locally
      }

      context.copy(initialConfiguration = context.initialConfiguration.withFallback(Configuration(loadedConfig)))
    }

    val application: Try[Application] = for {
      identity <-
        if (context.environment.mode == Mode.Dev) Success(DevIdentity("admin-console"))
        else AppIdentity.whoAmI(defaultAppName = "admin-console", Aws.credentialsProvider.build())
      newContext <- addConfigToContext(identity)
      stage = identity match {
        case AwsIdentity(_, _, s, _) => s
        case _                       => "DEV"
      }
      application <- Try(new AppComponents(newContext, stage).application)
    } yield application

    application match {
      case Success(app) => app
      case Failure(err) =>
        logger.error("Could not start application", err)
        throw err
    }
  }
}
