package services.promos

import com.typesafe.scalalogging.StrictLogging
import io.circe.syntax.EncoderOps
import models.DynamoErrors.{DynamoError, DynamoGetError}
import models.promos.PromoCampaign
import services.DynamoService
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, PutItemRequest, QueryRequest}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.ZIO

import scala.jdk.CollectionConverters._

class DynamoPromoCampaigns(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {
  protected val tableName = s"support-admin-console-promos-campaigns-$stage"

  def createCampaign(campaign: PromoCampaign): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      // Do not overwrite if already in dynamo
      .conditionExpression("attribute_not_exists(#campaignCode)")
      .expressionAttributeNames(Map("#campaignCode" -> "campaignCode").asJava)
      .build()
    put(request)
  }

  def updatePromo(campaign: PromoCampaign): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      .build()
    put(request)
  }

  def getCampaign(campaignCode: String): ZIO[Any, DynamoError, PromoCampaign] = {
    val request = QueryRequest.builder
      .tableName(tableName)
      .keyConditionExpression("campaignCode = :campaignCode")
      .expressionAttributeValues(
        Map(
          ":campaignCode" -> AttributeValue.builder.s(campaignCode).build
        ).asJava
      )
      .build()

    get(request)
      .map(item => dynamoMapToJson(item).as[PromoCampaign])
      .flatMap {
        case Right(test) => ZIO.succeed(test)
        case Left(error) => ZIO.fail(DynamoGetError(error))
      }
  }

}
