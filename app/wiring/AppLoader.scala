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
      val identity = AppIdentity.whoAmI(defaultAppName = "support-admin-console")
      val loadedConfig = ConfigurationLoader.load(identity) {
        case AwsIdentity(app, stack, stage, _) => SSMConfigurationLocation(s"/$app/$stage")
        case DevIdentity(app) =>
          FileConfigurationLocation(new File(s"/etc/gu/$app.private.conf"))  //assume conf is available locally
      }

      context.copy(initialConfiguration = context.initialConfiguration ++ Configuration(loadedConfig))
    }

    new AppComponents(newContext).application
  }
}
