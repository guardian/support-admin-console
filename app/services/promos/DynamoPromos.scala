package services.promo

import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
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
import utils.Circe.jsonToDynamo
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest
import models.DynamoErrors.DynamoError
import models.promos.Promo

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

}
