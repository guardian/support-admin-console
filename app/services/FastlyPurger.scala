package services

import com.typesafe.scalalogging.StrictLogging
import play.api.libs.ws.WSClient
import services.FastlyPurger.FastlyPurgerError
import zio.{IO, UIO}

import scala.concurrent.ExecutionContext

object FastlyPurger {
  case class FastlyPurgerError(error: String) extends Throwable
}

class FastlyPurger(url: String, ws: WSClient)(implicit val ec: ExecutionContext) extends StrictLogging {

  private def errorMessage = s"Update succeeded but failed to purge the fastly cache, speak to a Developer!"

  def purge: IO[Throwable, Unit] =
    IO.fromFuture { implicit ec =>
      ws.url(url).execute("PURGE")
    }.flatMap { result =>
      result.status match {
        case 200 =>
          logger.info(s"Purged fastly cache for $url")
          UIO.unit
        case other =>
          logger.error(s"Failed to purge fastly cache for $url: status $other, ${result.body}")
          IO.fail(FastlyPurgerError(errorMessage))
      }
    }
}
