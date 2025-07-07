package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.auto._
import models.DynamoErrors.DynamoGetError
import services.UserPermissions._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ScanRequest}
import utils.Circe.dynamoMapToJson
import zio._

import scala.jdk.CollectionConverters._
import java.util.concurrent.atomic.AtomicReference
import zio.ZIO.attemptBlocking

object UserPermissions {
  // The model for the user permissions that we store in DynamoDb
  sealed trait Permission
  object Permission {
    case object Read extends Permission
    case object Write extends Permission
    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val decoder: Decoder[Permission] = deriveEnumerationDecoder[Permission]
    implicit val encoder: Encoder[Permission] = deriveEnumerationEncoder[Permission]
  }
  case class PagePermission(name: String, permission: Permission)
  case class UserPermissions(email: String, permissions: List[PagePermission])

  implicit val encoder: Encoder[UserPermissions] = Encoder[UserPermissions]
  implicit val decoder: Decoder[UserPermissions] = Decoder[UserPermissions]
}

/** Polls the user permissions DynamoDb table and caches all permissions in memory
  */
class DynamoPermissionsCache(
    stage: String,
    client: DynamoDbClient,
    runtime: zio.Runtime[Any]
) extends DynamoService(stage, client)
    with StrictLogging {
  type Email = String

  protected val tableName = s"support-admin-console-permissions-$stage"

  private val permissionsCache = new AtomicReference[Map[Email, UserPermissions]](Map.empty)

  private def getAll: ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .scan(
          ScanRequest
            .builder()
            .tableName(tableName)
            .build()
        )
        .items()
    }.mapError(DynamoGetError)

  private def fetchPermissions(): ZIO[Any, DynamoGetError, Map[Email, UserPermissions]] =
    getAll.map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[UserPermissions])
        .flatMap {
          case Right(userPermissions) => Some(userPermissions)
          case Left(error)            =>
            logger.error(s"Failed to decode UserPermissions from Dynamo: ${error.getMessage}")
            None
        }
        .map(userPermissions => userPermissions.email -> userPermissions)
        .toMap
    )

  private def updatePermissions(permissions: Map[Email, UserPermissions]) = {
    permissionsCache.set(permissions)
    ZIO.succeed(())
  }

  // Poll every minute in the background
  Unsafe.unsafe { implicit unsafe =>
    runtime.unsafe.runToFuture {
      fetchPermissions()
        .map(updatePermissions)
        .repeat(Schedule.fixed(1.minute))
    }
  }

  def getPermissionsForUser(email: Email): Option[List[PagePermission]] = {
    permissionsCache.get().get(email).map(_.permissions)
  }
}
