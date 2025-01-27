package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors._
import models.{ArchivedTestsRow, Channel}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import utils.Circe.dynamoMapToJson
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

import scala.jdk.CollectionConverters.{ListHasAsScala, MapHasAsJava}

class DynamoArchivedChannelTests(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-archived-channel-tests-$stage"

  def putAllRaw(items: List[java.util.Map[String, AttributeValue]]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val writeRequests = items.map(item => WriteRequest.builder.putRequest(
      PutRequest
        .builder
        .item(item)
        .build()
    ).build())

    putAllBatched(writeRequests)
  }


  //   def get(): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
  //    effectBlocking {
  //      client.scan(
  //        ScanRequest
  //          .builder()
  //          .tableName(tableName)
  //          .build()
  //      ).items()
  //    }.mapError(DynamoGetError)

  private def get(channel: Channel): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] = {
    Console.println(s"Getting archived tests for channel $channel from $tableName")
    effectBlocking {
      client.query(
        QueryRequest
          .builder
          .tableName(tableName)
          .keyConditionExpression("channel = :channel")
          .expressionAttributeValues(Map(
            ":channel" -> AttributeValue.builder.s(channel.toString).build,
            ":archived" -> AttributeValue.builder.s("Archived").build
          ).asJava)
          .expressionAttributeNames(Map(
            "#status" -> "status"
          ).asJava)
          .filterExpression("#status <> :archived")
          .build()
      ).items
    }.mapError(DynamoGetError)
  }


  def getCurrentArchivedTestsRows(channel: Channel): ZIO[ZEnv, DynamoGetError, List[ArchivedTestsRow]] =
    get(channel).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[ArchivedTestsRow])
        .flatMap {
          case Right(row) => Some(row)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
    )
}
