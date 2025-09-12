package services.promos

import com.typesafe.scalalogging.StrictLogging
import io.circe.syntax.EncoderOps
import models.DynamoErrors.{DynamoError, DynamoGetError}
import models.promos.Promo
import models.promos.Promo.encoder
import services.DynamoService
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, PutItemRequest, QueryRequest}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.ZIO
import zio.ZIO.attemptBlocking

import scala.jdk.CollectionConverters._

class DynamoPromos(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {
  protected val tableName = s"support-admin-console-promos-$stage"
  private val campaignCodeIndex = "campaignCode-index"

  private def getAllInCampaign(
    campaignCode: String
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("campaignCode = :campaignCode")
            .indexName(campaignCodeIndex)
            .expressionAttributeValues(
              Map(
                ":campaignCode" -> AttributeValue.builder.s(campaignCode).build
              ).asJava
            )
            .build()
        )
        .items
    }.mapError(DynamoGetError)

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

  def updatePromo(promo: Promo): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(promo.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      .build()
    put(request)
  }

  def getPromo(promoCode: String): ZIO[Any, DynamoError, Promo] = {
    val query = QueryRequest.builder
      .tableName(tableName)
      .keyConditionExpression("promoCode = :promoCode")
      .expressionAttributeValues(
        Map(
          ":promoCode" -> AttributeValue.builder.s(promoCode).build
        ).asJava
      )
      .build()

    get(query)
      .map(item => dynamoMapToJson(item).as[Promo])
      .flatMap {
        case Right(test) => ZIO.succeed(test)
        case Left(error) => ZIO.fail(DynamoGetError(error))
      }
  }

  def getAllPromosInCampaign(campaignCode: String): ZIO[Any, DynamoError, List[Promo]] = {
    getAllInCampaign(campaignCode)
      .map(results =>
        results.asScala
          .map(item => dynamoMapToJson(item).as[Promo])
          .flatMap {
            case Right(test) => Some(test)
            case Left(error) =>
              logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
              None
          }
          .toList
          .sortBy(_.startTimestamp)
      )
  }
}
