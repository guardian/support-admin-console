package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.parser.decode
import models.promos.ProductCatalog
import play.api.libs.ws.WSClient
import zio._

import java.util.concurrent.atomic.AtomicReference
import scala.concurrent.ExecutionContext

class ProductCatalogCache(
  runtime: zio.Runtime[Any],
  wsClient: WSClient
)(implicit val ec: ExecutionContext) extends StrictLogging {

  private val url = "https://product-catalog.guardianapis.com/product-catalog.json"
  private val catalogCache = new AtomicReference[Option[ProductCatalog]](None)

  private def fetchCatalog(): ZIO[Any, Throwable, ProductCatalog] =
    ZIO.fromFuture { implicit ec =>
      wsClient
        .url(url)
        .get()
        .map { response =>
          decode[ProductCatalog](response.body)
        }
    }.flatMap {
      case Right(catalog) => ZIO.succeed(catalog)
      case Left(error)    => ZIO.fail(new Exception(error.getMessage))
    }

  private def updateCatalog(catalog: ProductCatalog) = {
    catalogCache.set(Some(catalog))
    ZIO.succeed(())
  }

  // Poll every 5 minutes in the background
  Unsafe.unsafe { implicit unsafe =>
    runtime.unsafe.runToFuture {
      fetchCatalog()
        .map(updateCatalog)
        .repeat(Schedule.fixed(5.minutes))
    }
  }

  def getCatalog: Option[ProductCatalog] = catalogCache.get()
}
