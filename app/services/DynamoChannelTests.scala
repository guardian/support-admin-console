package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import models.{Channel, ChannelTest}
import DynamoChannelTests._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, BatchWriteItemRequest, BatchWriteItemResponse, PutRequest, QueryRequest, WriteRequest}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.ZIO
import zio.blocking.{Blocking, effectBlocking}

import scala.jdk.CollectionConverters._

object DynamoChannelTests {
  sealed trait DynamoError extends Throwable
  case class DynamoPutError(error: Throwable) extends DynamoError
  case class DynamoGetError(error: Throwable) extends DynamoError
}

class DynamoChannelTests(stage: String) extends StrictLogging {

  private val tableName = s"support-admin-console-channel-tests-$stage"

  private val client = DynamoDbClient
    .builder
    .region(Aws.region)
    .credentialsProvider(Aws.credentialsProvider.build)
    .build

  private def getAll(channel: Channel): ZIO[Blocking, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client.query(
        QueryRequest
          .builder
          .tableName(tableName)
          .keyConditionExpression("channel = :channel")
          .expressionAttributeValues(Map(":channel" -> AttributeValue.builder.s(channel.toString).build).asJava)
          .build()
      ).items
    }.mapError(error =>
      DynamoGetError(error)
    )

  private def putAll(items: List[java.util.Map[String, AttributeValue]]): ZIO[Blocking, DynamoPutError, BatchWriteItemResponse] =
    effectBlocking {
      val writeRequests = items.map(item =>
        WriteRequest.builder.putRequest(
          PutRequest
            .builder
            .item(item)
            .build()
        ).build()
      )
      val batchWriteRequest =
        BatchWriteItemRequest
          .builder
          .requestItems(Map(tableName -> writeRequests.asJava).asJava)
          .build()

      val result = client.batchWriteItem(batchWriteRequest)
      logger.info(s"Batch write result: $result")
      result

    }.mapError(error =>
      DynamoPutError(error)
    )

  def getAllTests[T <: ChannelTest : Decoder](channel: Channel): ZIO[Blocking, DynamoGetError, List[T]] =
    getAll(channel).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[T])
        .flatMap {
          case Right(test) => Some(test)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.priority)
    )

  def createOrUpdateTests[T : Encoder](tests: List[T]): ZIO[Blocking, DynamoPutError, BatchWriteItemResponse] =
    putAll(
      tests.map(test => jsonToDynamo(test.asJson).m())
    )
}
