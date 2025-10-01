package services.promo

import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import models.promos.PromoCampaign
import models.DynamoErrors.DynamoGetError
import zio.ZIO
import zio.ZIO.attemptBlocking
import software.amazon.awssdk.services.dynamodb.model.QueryRequest
import utils.Circe.dynamoMapToJson
import io.circe.generic.auto._
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import services.DynamoService
import scala.jdk.CollectionConverters._
import models.promos.PromoProduct

class DynamoPromoCampaigns(stage: String, client: DynamoDbClient)
    extends DynamoService(stage, client)
    with StrictLogging {

  protected val tableName = s"support-admin-console-promo-campaigns-$stage"
  private val productIndex = "product-index"

  private def buildQuery(campaignCode: String): QueryRequest =
    QueryRequest.builder
      .tableName(tableName)
      .keyConditionExpression("campaignCode = :campaignCode")
      .expressionAttributeValues(
        Map(
          ":campaignCode" -> AttributeValue.builder.s(campaignCode).build
        ).asJava
      )
      .build()

  def getPromoCampaign(campaignCode: String): ZIO[Any, DynamoGetError, PromoCampaign] =
    get(buildQuery(campaignCode))
      .map(item => dynamoMapToJson(item).as[PromoCampaign])
      .flatMap {
        case Right(promoCampaign) => ZIO.succeed(promoCampaign)
        case Left(error)          => ZIO.fail(DynamoGetError(error))
      }

  def getAllPromoCampaigns(promoProduct: PromoProduct): ZIO[Any, DynamoGetError, List[PromoCampaign]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("product = :product")
            .indexName(productIndex)
            .expressionAttributeValues(
              Map(
                ":product" -> AttributeValue.builder.s(promoProduct.toString).build
              ).asJava
            )
            .build()
        )
        .items
        .asScala
        .map(item => dynamoMapToJson(item).as[PromoCampaign])
        .flatMap {
          case Right(promoCampaign) => Some(promoCampaign)
          case Left(error)          =>
            logger.error(s"Error decoding promo campaign from dynamo: $error")
            None
        }
        .toList
    }.mapError(DynamoGetError)
}
