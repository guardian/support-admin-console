package services

import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

class FastlyPurger(url: String, ws: WSClient)(implicit val ec: ExecutionContext) extends StrictLogging {

  private def errorMessage = s"Update succeeded but failed to purge the fastly cache, speak to a Developer!"

  def purge: Future[Either[String,Unit]] = {
    val result = ws.url(url).execute("PURGE").map { result =>
      result.status match {
        case 200 =>
          logger.info(s"Purged fastly cache for $url")
          Right(())
        case other =>
          logger.error(s"Failed to purge fastly cache for $url: status $other, ${result.body}")
          Left(errorMessage)
      }
    }

    result.recover { case error =>
      logger.error(s"Failed to purge fastly cache for $url. Error: ${error.getMessage}", error)
      Left(errorMessage)
    }
  }
}
