package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.DynamoGetError
import models.SuperModeRow
import models.SuperModeRow._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, QueryRequest}
import utils.Circe.dynamoMapToJson
import zio.ZIO

import java.text.SimpleDateFormat
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import scala.jdk.CollectionConverters._
import zio.ZIO.attemptBlocking

class DynamoSuperMode(client: DynamoDbClient) extends StrictLogging {
  private val tableName = s"super-mode-calculator-PROD"

  private val dateFormat = new SimpleDateFormat("yyyy-MM-dd")
  private val timestampFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")

  private def get(
      endDate: String,
      endTimestamp: String
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest
            .builder()
            .tableName(tableName)
            .indexName("end")
            .keyConditionExpression("endDate = :endDate AND endTimestamp > :endTimestamp")
            .expressionAttributeValues(
              Map(
                ":endDate" -> AttributeValue.builder.s(endDate).build,
                ":endTimestamp" -> AttributeValue.builder.s(endTimestamp).build
              ).asJava
            )
            .build()
        )
        .items()
    }.mapError(DynamoGetError)

  private def getRowsForDate(date: String, endTimestamp: String): ZIO[Any, DynamoGetError, List[SuperModeRow]] =
    get(date, endTimestamp).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[SuperModeRow])
        .flatMap {
          case Right(row)  => Some(row)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.endTimestamp)
    )

  def getCurrentSuperModeRows(): ZIO[Any, DynamoGetError, List[SuperModeRow]] = {

    /** Articles that are currently in super mode will have an endTimestamp later than now. Because the index partition
      * key is endDate, we have to make 2 queries for today and tomorrow
      */
    val today = Instant.now()
    val tomorrow = today.plus(1, ChronoUnit.DAYS)

    val endTimestamp = timestampFormat.format(Date.from(today))

    ZIO
      .collectAll(
        List(
          getRowsForDate(dateFormat.format(Date.from(today)), endTimestamp),
          getRowsForDate(dateFormat.format(Date.from(tomorrow)), endTimestamp)
        )
      )
      .map(_.flatten)
  }
}
