package services

import com.typesafe.scalalogging.StrictLogging
import models.Campaign
import services.DynamoChannelTests.DynamoGetError
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ScanRequest}
import utils.Circe.dynamoMapToJson
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

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
}
