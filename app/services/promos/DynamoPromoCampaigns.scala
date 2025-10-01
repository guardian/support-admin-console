package services.promo

import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import com.typesafe.scalalogging.StrictLogging
import models.promos.PromoCampaign
import models.DynamoErrors.DynamoGetError
import zio.ZIO
import software.amazon.awssdk.services.dynamodb.model.QueryRequest
import utils.Circe.dynamoMapToJson
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import services.DynamoService
import scala.jdk.CollectionConverters._

class DynamoPromoCampaigns(stage: String, client: DynamoDbClient)
    extends DynamoService(stage, client)
    with StrictLogging {

  protected val tableName = s"support-admin-console-promo-campaigns-$stage"

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
}
