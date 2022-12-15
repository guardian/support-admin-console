package services

import com.typesafe.scalalogging.StrictLogging
import models.{Campaign}
import models.DynamoErrors._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ConditionalCheckFailedException, PutItemRequest, ScanRequest}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}
import io.circe.syntax._

import scala.jdk.CollectionConverters._


class DynamoCampaigns(stage: String, client: DynamoDbClient) extends StrictLogging {

  private val tableName = s"support-admin-console-campaigns-$stage"

  private def getAll(): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client.scan(
        ScanRequest
          .builder()
          .tableName(tableName)
          .build()
      ).items()
    }.mapError(DynamoGetError)

  private def put(putRequest: PutItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.putItem(putRequest)
      logger.info(s"PutItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoDuplicateNameError(err)
      case other => DynamoPutError(other)
    }

  def getAllCampaigns(): ZIO[ZEnv, DynamoGetError, List[Campaign]] =
    getAll().map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[Campaign])
        .flatMap {
          case Right(campaign) => Some(campaign)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.name)
    )

  def createCampaign(campaign: Campaign): ZIO[ZEnv, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest
      .builder
      .tableName(tableName)
      .item(item)
      // Do not overwrite if already in dynamo
      .conditionExpression("attribute_not_exists(#name)")
      .expressionAttributeNames(Map("#name" -> "name").asJava)
      .build()
    put(request)
  }

  def updateCampaign(campaign: Campaign): ZIO[ZEnv, DynamoError, Unit] = {
    val item = jsonToDynamo(campaign.asJson).m()
    val request = PutItemRequest
      .builder
      .tableName(tableName)
      .item(item)
      .build()
    put(request)
  }
}
