package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import models.{Channel, ChannelTest}
import DynamoChannelTests._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, BatchWriteItemRequest, PutRequest, QueryRequest, WriteRequest}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.{ZEnv, ZIO}
import zio.blocking.effectBlocking
import zio.duration.durationInt
import zio.stream.ZStream

import scala.jdk.CollectionConverters._

object DynamoChannelTests {
  sealed trait DynamoError extends Throwable
  case class DynamoPutError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error writing to Dynamo: ${error.getMessage}"
  }
  case class DynamoGetError(error: Throwable) extends DynamoError {
    override def getMessage = s"Error reading from Dynamo: ${error.getMessage}"
  }
}

class DynamoChannelTests(stage: String) extends StrictLogging {

  private val tableName = s"support-admin-console-channel-tests-$stage"

  private val client = DynamoDbClient
    .builder
    .region(Aws.region)
    .credentialsProvider(Aws.credentialsProvider.build)
    .build

  private def getAll(channel: Channel): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
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

  // Sends a batch of write requests, and returns any unprocessed items
  private def putAll(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, List[WriteRequest]] =
    effectBlocking {
      val batchWriteRequest =
        BatchWriteItemRequest
          .builder
          .requestItems(Map(tableName -> writeRequests.asJava).asJava)
          .build()

      val result = client.batchWriteItem(batchWriteRequest)
      logger.info(s"BatchWriteItemResponse: $result")

      result.unprocessedItems().asScala
        .get(tableName)
        .map(items => items.asScala.toList)
        .getOrElse(Nil)

    }.mapError(error =>
      DynamoPutError(error)
    )

  /**
    * Dynamodb limits us to batches of 25 items, and may return unprocessed items in the response.
    * This function groups items into batches of 25, and also checks the `unprocessedItems` in case we need to send
    * any again.
    * It uses an infinite zio stream to do this, pausing between batches to avoid any throttling. It stops processing
    * the stream when the list of batches is empty.
    */
  private val BATCH_SIZE = 25
  def putAllBatched(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val batches = writeRequests.grouped(BATCH_SIZE).toList
    ZStream(())
      .forever
      .fixed(2.seconds) // wait 2 seconds between batches
      .timeoutError(DynamoPutError(new Throwable("Timed out writing batches to dynamodb")))(1.minute)
      .foldWhileM(batches)(_.nonEmpty) {
        case (nextBatch :: remainingBatches, _) =>
          logger.info(s"next batch: $nextBatch")
          putAll(nextBatch).map {
            case Nil => remainingBatches
            case unprocessed => unprocessed :: remainingBatches
          }
        case (Nil, _) =>
          logger.info(s"finished batches")
          ZIO.succeed(Nil)
      }
      .map(_ => ()) // on success, the result value isn't meaningful
  }

  def getAllTests[T <: ChannelTest[T] : Decoder](channel: Channel): ZIO[ZEnv, DynamoGetError, List[T]] =
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

  def createOrUpdateTests[T <: ChannelTest[T] : Encoder](tests: List[T], channel: Channel): ZIO[ZEnv, DynamoPutError, Unit] = {
    val writeRequests = tests.zipWithIndex.map { case (test, priority) =>
      // Add the priority and channel fields, which we don't have in S3
      val prioritised = test.withPriority(priority).withChannel(channel)
      val item = jsonToDynamo(prioritised.asJson).m()
      WriteRequest.builder.putRequest(
        PutRequest
          .builder
          .item(item)
          .build()
      ).build()
    }
    logger.info(s"About to batch put: $writeRequests")

    putAllBatched(writeRequests)
  }
}
