package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.DynamoGetError
import models.SuperModeRow
import models.SuperModeRow._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, QueryRequest}
import utils.Circe.dynamoMapToJson
import zio.{ZEnv, ZIO}
import zio.blocking.effectBlocking

import scala.jdk.CollectionConverters._

class DynamoSuperMode(client: DynamoDbClient) extends StrictLogging {
  private val tableName = s"super-mode-PROD"

  private def get(endDate: String, endTimestamp: String): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client.query(
        QueryRequest
          .builder()
          .tableName(tableName)
          .indexName("end")
          .keyConditionExpression("endDate = :endDate AND endTimestamp > :endTimestamp")
          .expressionAttributeValues(Map(
            ":endDate" -> AttributeValue.builder.s(endDate).build,
            ":endTimestamp" -> AttributeValue.builder.s(endTimestamp).build
          ).asJava)
          .build()
      ).items()
    }.mapError(DynamoGetError)

  def getRowsForDate(endTimestamp: String, date: String) = {
    get(date, endTimestamp).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[SuperModeRow])
        .flatMap {
          case Right(row) => Some(row)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.endTimestamp)
    )
  }

  def getRows(endTimestamp: String, todayDate: String, tomorrowDate: String): ZIO[ZEnv, DynamoGetError, List[SuperModeRow]] =
    ZIO.collectAll(List(
      getRowsForDate(endTimestamp, todayDate),
      getRowsForDate(endTimestamp, tomorrowDate)
    )).map(_.flatten)
}
