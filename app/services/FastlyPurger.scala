package services

import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import services.FastlyPurger.FastlyPurgerError
import zio.IO

import scala.concurrent.ExecutionContext

object FastlyPurger {
  case class FastlyPurgerError(error: String) extends Throwable
}

class FastlyPurger(url: String, ws: WSClient)(implicit val ec: ExecutionContext) extends StrictLogging {

  private def errorMessage = s"Update succeeded but failed to purge the fastly cache, speak to a Developer!"

  //TODO - narrow error type to FastlyPurgerError
  def purge: IO[Throwable, Unit] = {
    IO.fromFuture { implicit ec =>
      val result = ws.url(url).execute("PURGE").map { result =>
        result.status match {
          case 200 =>
            logger.info(s"Purged fastly cache for $url")
            Right(())
          case other =>
            logger.error(s"Failed to purge fastly cache for $url: status $other, ${result.body}")
            Left(FastlyPurgerError(errorMessage))
        }
      }

      result.recover { case error =>
        logger.error(s"Failed to purge fastly cache for $url. Error: ${error.getMessage}", error)
        Left(FastlyPurgerError(errorMessage))
      }
    }.flatMap(IO.fromEither)
  }
}
