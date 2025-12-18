package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.auto._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import models.DynamoErrors.{DynamoGetError, DynamoError}
import services.UserPermissions._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio._
import io.circe.syntax._
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest

import scala.jdk.CollectionConverters._
import java.util.concurrent.atomic.AtomicReference

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

  implicit val encoder: Encoder[UserPermissions] = deriveEncoder[UserPermissions]
  implicit val decoder: Decoder[UserPermissions] = deriveDecoder[UserPermissions]
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

  private def fetchPermissions(): ZIO[Any, DynamoGetError, Map[Email, UserPermissions]] =
    getAll().map(results =>
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

  def getAllUsers(): ZIO[Any, Nothing, List[UserPermissions]] = {
    ZIO.succeed(permissionsCache.get().values.toList)
  }

  def upsertUser(user: UserPermissions): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(user.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      .build()
    put(request).tap(_ => 
      // Update cache after successful write
      ZIO.succeed(permissionsCache.updateAndGet(cache => cache + (user.email -> user)))
    )
  }
}
