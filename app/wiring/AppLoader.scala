package wiring

import java.io.File

import com.typesafe.scalalogging.StrictLogging
import play.api.ApplicationLoader.Context
import play.api._
import play.api.libs.logback.LogbackLoggerConfigurator
import com.gu.{AppIdentity, AwsIdentity, DevIdentity}
import com.gu.conf.{ConfigurationLoader, FileConfigurationLocation, SSMConfigurationLocation}

class AppLoader extends ApplicationLoader with StrictLogging {

  override def load(context: Context): Application = {
    new LogbackLoggerConfigurator().configure(context.environment)

    val newContext = {
      val identity = AppIdentity.whoAmI(defaultAppName = "admin-console")
      val loadedConfig = ConfigurationLoader.load(identity) {
        case AwsIdentity(app, stack, stage, _) => SSMConfigurationLocation(s"/$app/$stage")
        case DevIdentity(app) =>
          FileConfigurationLocation(new File(s"/etc/gu/support-admin-console.private.conf"))  //assume conf is available locally
      }

      context.copy(initialConfiguration = context.initialConfiguration ++ Configuration(loadedConfig))
    }

    try {
      new AppComponents(newContext).application
    } catch {
      case err: Throwable => {
        logger.error("Could not start application", err)
        throw err
      }
    }
  }
}
