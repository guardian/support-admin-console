package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoPutError}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{BatchWriteItemRequest, ConditionalCheckFailedException, PutItemRequest, ReturnConsumedCapacity, TransactWriteItem, TransactWriteItemsRequest, WriteRequest}
import zio.{ZEnv, ZIO}
import zio.blocking.effectBlocking
import zio.stream.ZStream
import zio.duration.durationInt

import scala.jdk.CollectionConverters._

// Shared functionality for DynamoDb services
abstract class DynamoService(stage: String, client: DynamoDbClient)
    extends StrictLogging {
  protected val tableName: String

  protected def put(putRequest: PutItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.putItem(putRequest)
      logger.info(s"PutItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoDuplicateNameError(err)
      case other => DynamoPutError(other)
    }

  // Sends a batch of write requests, and returns any unprocessed items
  protected def putAll(writeRequests: List[WriteRequest])
    : ZIO[ZEnv, DynamoPutError, List[WriteRequest]] =
    effectBlocking {
      val batchWriteRequest =
        BatchWriteItemRequest.builder
          .requestItems(Map(tableName -> writeRequests.asJava).asJava)
          .returnConsumedCapacity(ReturnConsumedCapacity.TOTAL)
          .build()

      val result = client.batchWriteItem(batchWriteRequest)
      logger.info(s"BatchWriteItemResponse: $result")

      result
        .unprocessedItems()
        .asScala
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

  protected def putAllBatched(
      writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val batches = writeRequests.grouped(BATCH_SIZE).toList
    ZStream(()).forever
      .fixed(2.seconds) // wait 2 seconds between batches
      .timeoutError(DynamoPutError(
        new Throwable("Timed out writing batches to dynamodb")))(1.minute)
      .foldWhileM(batches)(_.nonEmpty) {
        case (nextBatch :: remainingBatches, _) =>
          putAll(nextBatch).map {
            case Nil         => remainingBatches
            case unprocessed => unprocessed :: remainingBatches
          }
        case (Nil, _) => ZIO.succeed(Nil)
      }
      .unit // on success, the result value isn't meaningful
  }

  /**
    * Dynamodb limits us to batches of 25 items.
    * This function groups items into batches of 25. Each batch is sent as a transaction, and if any transaction
    * fails then an error is returned to the client (no retries).
    * It uses a zio stream to do this, pausing between batches to avoid any throttling and timing out after 1 minute.
    */
  protected def putAllBatchedTransaction(
      items: List[TransactWriteItem]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val batches = items.grouped(BATCH_SIZE).toList
    ZStream
      .fromIterable(batches)
      .fixed(2.seconds) // wait 2 seconds between batches
      .timeoutError(DynamoPutError(
        new Throwable("Timed out writing batches to dynamodb")))(1.minute)
      .mapM(putAllTransaction)
      .runCollect
      .unit
  }

  private def putAllTransaction(
      items: List[TransactWriteItem]): ZIO[ZEnv, DynamoPutError, Unit] =
    effectBlocking {
      val request = TransactWriteItemsRequest.builder
        .transactItems(items.asJava)
        .build()

      val result = client.transactWriteItems(request)
      logger.info(s"TransactWriteItemsResponse: $result")
      ()
    }.mapError(DynamoPutError)

}
