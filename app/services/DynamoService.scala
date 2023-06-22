package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.DynamoPutError
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{BatchWriteItemRequest, ReturnConsumedCapacity, WriteRequest}
import zio.{ZEnv, ZIO}
import zio.blocking.effectBlocking
import zio.stream.ZStream
import zio.duration.durationInt

import scala.jdk.CollectionConverters._

// Shared functionality for DynamoDb services
abstract class DynamoService(stage: String, client: DynamoDbClient) extends StrictLogging {
  protected val tableName: String

  // Sends a batch of write requests, and returns any unprocessed items
  protected def putAll(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, List[WriteRequest]] =
    effectBlocking {
      val batchWriteRequest =
        BatchWriteItemRequest
          .builder
          .requestItems(Map(tableName -> writeRequests.asJava).asJava)
          .returnConsumedCapacity(ReturnConsumedCapacity.TOTAL)
          .build()

      val result = client.batchWriteItem(batchWriteRequest)
      logger.info(s"BatchWriteItemResponse: $result")

      result.unprocessedItems().asScala
        .get(tableName)
        .map(items => items.asScala.toList)
        .getOrElse(Nil)

    }.mapError(DynamoPutError)

  /**
   * Dynamodb limits us to batches of 25 items, and may return unprocessed items in the response.
   * This function groups items into batches of 25, and also checks the `unprocessedItems` in case we need to send
   * any again.
   * It uses an infinite zio stream to do this, pausing between batches to avoid any throttling. It stops processing
   * the stream when the list of batches is empty.
   */
  protected val BATCH_SIZE = 25

  protected def putAllBatched(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val batches = writeRequests.grouped(BATCH_SIZE).toList
    ZStream(())
      .forever
      .fixed(2.seconds) // wait 2 seconds between batches
      .timeoutError(DynamoPutError(new Throwable("Timed out writing batches to dynamodb")))(1.minute)
      .foldWhileM(batches)(_.nonEmpty) {
        case (nextBatch :: remainingBatches, _) =>
          putAll(nextBatch).map {
            case Nil => remainingBatches
            case unprocessed => unprocessed :: remainingBatches
          }
        case (Nil, _) => ZIO.succeed(Nil)
      }
      .unit // on success, the result value isn't meaningful
  }
}