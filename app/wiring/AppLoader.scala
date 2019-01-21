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

    val identity = AppIdentity.whoAmI(defaultAppName = "admin-console")
    val loadedConfig = ConfigurationLoader.load(identity) {
      case AwsIdentity(app, stack, stage, _) => SSMConfigurationLocation(s"/$app/$stage")
      case DevIdentity(app) =>
        FileConfigurationLocation(new File(s"/etc/gu/support-admin-console.private.conf"))  //assume conf is available locally
    }

    val newContext = context.copy(initialConfiguration = context.initialConfiguration ++ Configuration(loadedConfig))

    val stage = identity match {
      case AwsIdentity(_, _, s, _) => s
      case _ => "DEV"
    }

    try {
      new AppComponents(newContext, stage).application
    } catch {
      case err: Throwable => {
        logger.error("Could not start application", err)
        throw err
      }
    }
  }
}
