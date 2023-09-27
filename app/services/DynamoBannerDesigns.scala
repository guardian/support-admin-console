package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.syntax._
import models.DynamoErrors._
import models._
import models.BannerDesign
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

import java.time.OffsetDateTime
import scala.jdk.CollectionConverters._

class DynamoBannerDesigns(stage: String, client: DynamoDbClient)
    extends DynamoService(stage, client)
    with StrictLogging {

  protected val tableName = s"support-admin-console-banner-designs-$stage"

  private def buildKey(
      designName: String): java.util.Map[String, AttributeValue] =
    Map(
      "name" -> AttributeValue.builder.s(designName).build
    ).asJava

  /**
    * Attempts to retrieve a banner design from dynamodb. Fails if the banner design does not exist.
    */
  private def get(designName: String)
    : ZIO[ZEnv, DynamoGetError, java.util.Map[String, AttributeValue]] =
    effectBlocking {
      val query = QueryRequest.builder
        .tableName(tableName)
        .keyConditionExpression("#name = :name")
        .expressionAttributeValues(
          Map(
            ":name" -> AttributeValue.builder.s(designName).build
          ).asJava
        )
        .expressionAttributeNames(Map("#name" -> "name").asJava) // name is a reserved word in dynamodb
        .build()

      client
        .query(query)
        .items
        .asScala
        .headOption

    }.flatMap {
        case Some(item) => ZIO.succeed(item)
        case None =>
          ZIO.fail(
            DynamoGetError(
              new Exception(s"Banner design does not exist: $designName")))
      }
      .mapError(error => DynamoGetError(error))

  private def getAll()
    : ZIO[ZEnv,
          DynamoGetError,
          java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client
        .scan(
          ScanRequest
            .builder()
            .tableName(tableName)
            .build()
        )
        .items()
    }.mapError(DynamoGetError)

  private def put(putRequest: PutItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.putItem(putRequest)
      logger.info(s"PutItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoDuplicateNameError(err)
      case other                                => DynamoPutError(other)
    }

  private def update(
      updateRequest: UpdateItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.updateItem(updateRequest)
      logger.info(s"UpdateItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoNoLockError(err)
      case other                                => DynamoPutError(other)
    }

  def getBannerDesign(
      designName: String): ZIO[ZEnv, DynamoGetError, BannerDesign] =
    get(designName)
      .map(item => dynamoMapToJson(item).as[BannerDesign])
      .flatMap {
        case Right(bannerDesign) => ZIO.succeed(bannerDesign)
        case Left(error)         => ZIO.fail(DynamoGetError(error))
      }

  def getAllBannerDesigns(): ZIO[ZEnv, DynamoGetError, List[BannerDesign]] =
    getAll().map(
      results =>
        results.asScala
          .map(item => dynamoMapToJson(item).as[BannerDesign])
          .flatMap {
            case Right(bannerDesign) => Some(bannerDesign)
            case Left(error) =>
              logger.error(
                s"Failed to decode item from Dynamo: ${error.getMessage}")
              None
          }
          .toList
    )

  /**
    * With an UpdateItem request we have to provide an expression to specify each attribute to be updated.
    * We do this by iterating over the attributes in `item` and building an expression
    */
  private def buildUpdateBannerDesignExpression(
      item: Map[String, AttributeValue]): String = {
    val subExprs = item.foldLeft[List[String]](Nil) {
      case (acc, (key, value)) =>
        s"$key = :$key" +: acc
    }
    s"set ${subExprs.mkString(", ")} remove lockStatus" // Unlock the banner design at the same time
  }

  def createBannerDesign(
      bannerDesign: BannerDesign): ZIO[ZEnv, DynamoError, Unit] = {
    val item = jsonToDynamo(bannerDesign.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      // Do not overwrite if already in dynamo
      .conditionExpression("attribute_not_exists(#name)")
      .expressionAttributeNames(Map("#name" -> "name").asJava)
      .build()
    put(request)
  }

  def updateBannerDesign(bannerDesign: BannerDesign,
                         email: String): ZIO[ZEnv, DynamoError, Unit] = {
    val item = jsonToDynamo(bannerDesign.asJson).m().asScala.toMap -
      "lockStatus" - // Unlock by removing lockStatus
      "name" - // key field"
      "status" // status updates happen separately

    val updateExpression = buildUpdateBannerDesignExpression(item)

    val attributeValues = item.map { case (key, value) => s":$key" -> value }
    // Add email, for the conditional update
    val attributeValuesWithEmail = attributeValues + (":email" -> AttributeValue.builder
      .s(email)
      .build)

    val updateRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(buildKey(bannerDesign.name))
      .updateExpression(updateExpression)
      .expressionAttributeValues(attributeValuesWithEmail.asJava)
      .conditionExpression("lockStatus.email = :email")
      .build()

    update(updateRequest)
  }

  def lockBannerDesign(designName: String,
                       email: String,
                       force: Boolean): ZIO[ZEnv, DynamoError, Unit] = {
    val lockStatus = LockStatus(
      locked = true,
      email = Some(email),
      timestamp = Some(OffsetDateTime.now())
    )
    val request = {
      val builder = UpdateItemRequest.builder
        .tableName(tableName)
        .key(buildKey(designName))
        .updateExpression("set lockStatus = :lockStatus")
        .expressionAttributeValues(
          Map(
            ":lockStatus" -> jsonToDynamo(lockStatus.asJson)
          ).asJava)

      if (!force) {
        // Check it isn't already locked
        builder.conditionExpression("attribute_not_exists(lockStatus.email)")
      }

      builder.build()
    }

    update(request)
  }

  // Removes the lockStatus attribute if the user currently has it locked
  def unlockBannerDesign(designName: String,
                         email: String): ZIO[ZEnv, DynamoError, Unit] = {
    val request = UpdateItemRequest.builder
      .tableName(tableName)
      .key(buildKey(designName))
      .updateExpression("remove lockStatus")
      .conditionExpression("lockStatus.email = :email")
      .expressionAttributeValues(Map(
        ":email" -> AttributeValue.builder.s(email).build
      ).asJava)
      .build()

    update(request)
  }

  def deleteBannerDesigns(designNames: List[String],
                          channel: Channel): ZIO[ZEnv, DynamoPutError, Unit] = {
    val deleteRequests = designNames.map { designName =>
      WriteRequest.builder
        .deleteRequest(
          DeleteRequest.builder
            .key(buildKey(designName))
            .build()
        )
        .build()
    }

    logger.info(s"About to batch delete: $deleteRequests")
    putAllBatched(deleteRequests)
  }

  def updateStatus(
      designName: String,
      status: BannerDesignStatus
  ): ZIO[ZEnv, DynamoError, Unit] = {
    val updateRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(buildKey(designName))
      .updateExpression("SET #status = :status")
      .expressionAttributeValues(
        Map(
          ":status" -> jsonToDynamo(status.asJson)
        ).asJava)
      .expressionAttributeNames(Map(
        // status is a reserved keyword in dynamodb
        "#status" -> "status"
      ).asJava)
      .conditionExpression("#name = :name") // only update if it already exists in the table
      .build()

    update(updateRequest)
  }
}
