package services.promo

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax._
import java.time.OffsetDateTime
import models.DynamoErrors._
import models.LockStatus
import models.promos.Promo
import scala.jdk.CollectionConverters._
import services.DynamoService
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import utils.Circe.dynamoMapToJson
import utils.Circe.jsonToDynamo
import zio.ZIO
import zio.ZIO.attemptBlocking

class DynamoPromos(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-promos-$stage"
  private val campaignCodeIndex = "campaignCode-index"

  private def buildQuery(promoCode: String): QueryRequest =
    QueryRequest.builder
      .tableName(tableName)
      .keyConditionExpression("promoCode = :promoCode")
      .expressionAttributeValues(
        Map(
          ":promoCode" -> AttributeValue.builder.s(promoCode).build
        ).asJava
      )
      .build()

  def getPromo(promoCode: String): ZIO[Any, DynamoGetError, Promo] =
    get(buildQuery(promoCode))
      .map(item => dynamoMapToJson(item).as[Promo])
      .flatMap {
        case Right(promo) => ZIO.succeed(promo)
        case Left(error)  => ZIO.fail(DynamoGetError(error))
      }

  def createPromo(promo: Promo): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(promo.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      // Do not overwrite if already in dynamo
      .conditionExpression("attribute_not_exists(#promoCode)")
      .expressionAttributeNames(Map("#promoCode" -> "promoCode").asJava)
      .build()
    put(request)
  }

  private def update(updateRequest: UpdateItemRequest): ZIO[Any, DynamoError, Unit] =
    attemptBlocking {
      val result = client.updateItem(updateRequest)
      logger.info(s"UpdateItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoNoLockError(err)
      case other                                => DynamoPutError(other)
    }

  def lockPromo(promoCode: String, email: String, force: Boolean): ZIO[Any, DynamoError, Unit] = {
    val lockStatus = LockStatus(
      locked = true,
      email = Some(email),
      timestamp = Some(OffsetDateTime.now())
    )
    val request = {
      val builder = UpdateItemRequest.builder
        .tableName(tableName)
        .key(Map("promoCode" -> AttributeValue.builder.s(promoCode).build()).asJava)
        .updateExpression("set lockStatus = :lockStatus")
        .expressionAttributeValues(
          Map(
            ":lockStatus" -> jsonToDynamo(lockStatus.asJson)
          ).asJava
        )
        .expressionAttributeNames(Map("#promoCode" -> "promoCode").asJava)

      val itemExistsExpression = "attribute_exists(#promoCode)" // only update if it already exists in the table
      if (!force) {
        // Check it isn't already locked
        builder.conditionExpression(s"$itemExistsExpression and attribute_not_exists(lockStatus.email)")
      } else {
        builder.conditionExpression(itemExistsExpression)
      }

      builder.build()
    }

    update(request)
  }

  def unlockPromo(promoCode: String, email: String): ZIO[Any, DynamoError, Unit] = {
    val request = UpdateItemRequest.builder
      .tableName(tableName)
      .key(Map("promoCode" -> AttributeValue.builder.s(promoCode).build()).asJava)
      .updateExpression("remove lockStatus")
      .conditionExpression("lockStatus.email = :email")
      .expressionAttributeValues(
        Map(
          ":email" -> AttributeValue.builder.s(email).build
        ).asJava
      )
      .build()

    update(request)
  }

  def getAllPromos(campaignCode: String): ZIO[Any, DynamoGetError, List[Promo]] =
    getAllInCampaign(campaignCode).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[Promo])
        .flatMap {
          case Right(promo) => Some(promo)
          case Left(error)  =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
    )

  private def getAllInCampaign(
      campaignCode: String
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("campaignCode = :campaignCode")
            .expressionAttributeValues(
              Map(
                ":campaignCode" -> AttributeValue.builder.s(campaignCode).build
              ).asJava
            )
            .build()
        )
        .items
    }.mapError(DynamoGetError)
}
