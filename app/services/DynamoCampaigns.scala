package services

import com.typesafe.scalalogging.StrictLogging
import models.{Campaign}
import models.DynamoErrors._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{
  AttributeValue,
  ConditionalCheckFailedException,
  PutItemRequest,
  ScanRequest
}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.ZIO
import io.circe.syntax._

import scala.jdk.CollectionConverters._
import zio.ZIO.attemptBlocking

class DynamoCampaigns(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-campaigns-$stage"

  def getAllCampaigns(): ZIO[Any, DynamoGetError, List[Campaign]] =
    getAll().map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[Campaign])
        .flatMap {
          case Right(campaign) => Some(campaign)
          case Left(error)     =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.name)
    )

  def createCampaign(campaign: Campaign): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      // Do not overwrite if already in dynamo
      .conditionExpression("attribute_not_exists(#name)")
      .expressionAttributeNames(Map("#name" -> "name").asJava)
      .build()
    put(request)
  }

  def updateCampaign(campaign: Campaign): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(item)
      .build()
    put(request)
  }
}
