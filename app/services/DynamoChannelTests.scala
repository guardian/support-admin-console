package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.auto._
import io.circe.syntax._
import io.circe.{Decoder, Encoder}
import models.DynamoErrors._
import models._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.blocking.effectBlocking
import zio.duration.durationInt
import zio.stream.ZStream
import zio.{ZEnv, ZIO}

import java.time.OffsetDateTime
import scala.jdk.CollectionConverters._


class DynamoChannelTests(stage: String, client: DynamoDbClient) extends StrictLogging {

  private val tableName = s"support-admin-console-channel-tests-$stage"
  private val campaignNameIndex = "campaignName-name-index"

  private def buildKey(channel: Channel, testName: String): java.util.Map[String, AttributeValue] =
    Map(
      "channel" -> AttributeValue.builder.s(channel.toString).build,
      "name" -> AttributeValue.builder.s(testName).build
    ).asJava

  /**
    * Attempts to retrieve a test from dynamodb. Fails if the test does not exist.
    */
  private def get(testName: String, channel: Channel): ZIO[ZEnv, DynamoGetError, java.util.Map[String, AttributeValue]] =
    effectBlocking {
      val query = QueryRequest
        .builder
        .tableName(tableName)
        .keyConditionExpression("channel = :channel AND #name = :name")
        .expressionAttributeValues(
          Map(
            ":channel" -> AttributeValue.builder.s(channel.toString).build,
            ":name" -> AttributeValue.builder.s(testName).build
          ).asJava
        )
        .expressionAttributeNames(Map("#name" -> "name").asJava)  // name is a reserved word in dynamodb
        .build()

      client
        .query(query)
        .items.asScala.headOption

    }.flatMap {
      case Some(item) => ZIO.succeed(item)
      case None => ZIO.fail(DynamoGetError(new Exception(s"Test does not exist: $channel/$testName")))
    }.mapError(error =>
      DynamoGetError(error)
    )

  private def getAll(channel: Channel): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
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

  // TODO - migrate to use the new archived tests table
  def getAllArchived(channel: Channel): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
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
          .filterExpression("#status = :archived")
          .build()
      ).items
    }.mapError(DynamoGetError)

  private def getAllInCampaign(campaignName: String): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client.query(
        QueryRequest
          .builder
          .tableName(tableName)
          .keyConditionExpression("campaignName = :campaignName")
          .indexName(campaignNameIndex)
          .expressionAttributeValues(Map(
            ":campaignName" -> AttributeValue.builder.s(campaignName).build
          ).asJava)
          .build()
      ).items
    }.mapError(DynamoGetError)

  // Sends a batch of write requests, and returns any unprocessed items
  private def putAll(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, List[WriteRequest]] =
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

  private def put(putRequest: PutItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.putItem(putRequest)
      logger.info(s"PutItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoDuplicateNameError(err)
      case other => DynamoPutError(other)
    }

  private def update(updateRequest: UpdateItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.updateItem(updateRequest)
      logger.info(s"UpdateItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoNoLockError(err)
      case other => DynamoPutError(other)
    }

  private def putAllTransaction(items: List[TransactWriteItem]): ZIO[ZEnv, DynamoPutError, Unit] =
    effectBlocking {
      val request = TransactWriteItemsRequest
        .builder
        .transactItems(items.asJava)
        .build()

      val result = client.transactWriteItems(request)
      logger.info(s"TransactWriteItemsResponse: $result")
      ()
    }.mapError(DynamoPutError)

  /**
    * Dynamodb limits us to batches of 25 items, and may return unprocessed items in the response.
    * This function groups items into batches of 25, and also checks the `unprocessedItems` in case we need to send
    * any again.
    * It uses an infinite zio stream to do this, pausing between batches to avoid any throttling. It stops processing
    * the stream when the list of batches is empty.
    */
  private val BATCH_SIZE = 25
  private def putAllBatched(writeRequests: List[WriteRequest]): ZIO[ZEnv, DynamoPutError, Unit] = {
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

  /**
    * Dynamodb limits us to batches of 25 items.
    * This function groups items into batches of 25. Each batch is sent as a transaction, and if any transaction
    * fails then an error is returned to the client (no retries).
    * It uses a zio stream to do this, pausing between batches to avoid any throttling and timing out after 1 minute.
    */
  private def putAllBatchedTransaction(items: List[TransactWriteItem]): ZIO[ZEnv, DynamoPutError, Unit] = {
    val batches = items.grouped(BATCH_SIZE).toList
    ZStream.fromIterable(batches)
      .fixed(2.seconds) // wait 2 seconds between batches
      .timeoutError(DynamoPutError(new Throwable("Timed out writing batches to dynamodb")))(1.minute)
      .mapM(putAllTransaction)
      .runCollect
      .unit
  }

  def getTest[T <: ChannelTest[T] : Decoder](testName: String, channel: Channel): ZIO[ZEnv, DynamoGetError, T] =
    get(testName, channel)
      .map(item => dynamoMapToJson(item).as[T])
      .flatMap {
        case Right(test) => ZIO.succeed(test)
        case Left(error) => ZIO.fail(DynamoGetError(error))
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

  // Does not decode the Dynamodb data
  def getRawTests(channel: Channel, testNames: List[String]): ZIO[ZEnv, DynamoGetError, List[java.util.Map[String, AttributeValue]]] = {
    // Build a batch item request
    val items = testNames.map(testName => buildKey(channel, testName))
    val keysAndAttributes = KeysAndAttributes.builder().keys(items.asJava).build()

    val request = BatchGetItemRequest.builder()
      .requestItems(Map(tableName -> keysAndAttributes).asJava)
      .build()

    effectBlocking {
      client.batchGetItem(request)
        .responses().asScala.get(tableName).map(_.asScala.toList).getOrElse(Nil)
    }.mapError(DynamoGetError)
  }

  // Returns all tests in a campaign, sorted by channel
  import models.ChannelTest.channelTestDecoder
  def getAllTestsInCampaign(campaignName: String): ZIO[ZEnv, DynamoGetError, List[ChannelTest[_]]] =
    getAllInCampaign(campaignName)
      .map(results =>
        results.asScala
          .map(item => dynamoMapToJson(item).as[ChannelTest[_]])
          .flatMap {
            case Right(test) => Some(test)
            case Left(error) =>
              logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
              None
          }
          .toList
          .sortBy(_.channel.toString)
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

  /**
    * With an UpdateItem request we have to provide an expression to specify each attribute to be updated.
    * We do this by iterating over the attributes in `item` and building an expression
    */
  private def buildUpdateTestExpression(item: Map[String, AttributeValue]): String = {
    val subExprs = item.foldLeft[List[String]](Nil) { case (acc, (key, value)) =>
      s"$key = :$key" +: acc
    }
    s"set ${subExprs.mkString(", ")} remove lockStatus" // Unlock the test at the same time
  }

  def updateTest[T <: ChannelTest[T] : Encoder](test: T, channel: Channel, email: String): ZIO[ZEnv, DynamoError, Unit] = {
    val item = jsonToDynamo(test.asJson).m().asScala.toMap -
      "status" -      // Do not update status - this is a separate action
      "priority" -    // Do not update priority - this is a separate action
      "lockStatus" -  // Unlock by removing lockStatus
      "name" -        // key field
      "channel"       // key field

    val updateExpression = buildUpdateTestExpression(item)

    val attributeValues = item.map { case (key, value) => s":$key" -> value }
    // Add email, for the conditional update
    val attributeValuesWithEmail = attributeValues + (":email" -> AttributeValue.builder.s(email).build)

    val updateRequest = UpdateItemRequest
      .builder
      .tableName(tableName)
      .key(buildKey(channel, test.name))
      .updateExpression(updateExpression)
      .expressionAttributeValues(attributeValuesWithEmail.asJava)
      .conditionExpression("lockStatus.email = :email")
      .build()

    update(updateRequest)
  }

  // Returns the value of the bottom priority test - which is the highest value, because 0 is top priority
  private def getBottomPriority[T <: ChannelTest[T] : Decoder](channel: Channel): ZIO[ZEnv, DynamoError, Int] =
    getAllTests[T](channel)
      .map(allTests => allTests.flatMap(_.priority).maxOption.getOrElse(0))

  // Creates a new test, with bottom priority
  def createTest[T <: ChannelTest[T] : Encoder : Decoder](test: T, channel: Channel): ZIO[ZEnv, DynamoError, Unit] =
    getBottomPriority[T](channel)
      .flatMap(bottomPriority => {
        val priority = bottomPriority + 1
        val item = jsonToDynamo(test.withChannel(channel).withPriority(priority).asJson).m()
        val request = PutItemRequest
          .builder
          .tableName(tableName)
          .item(item)
          // Do not overwrite if already in dynamo
          .conditionExpression("attribute_not_exists(#name)")
          .expressionAttributeNames(Map("#name" -> "name").asJava)
          .build()
        put(request)
      })

  def lockTest(testName: String, channel: Channel, email: String, force: Boolean): ZIO[ZEnv, DynamoError, Unit] = {
    val lockStatus = LockStatus(
      locked = true,
      email = Some(email),
      timestamp = Some(OffsetDateTime.now())
    )
    val request = {
      val builder = UpdateItemRequest
        .builder
        .tableName(tableName)
        .key(buildKey(channel, testName))
        .updateExpression("set lockStatus = :lockStatus")
        .expressionAttributeValues(Map(
          ":lockStatus" -> jsonToDynamo(lockStatus.asJson)
        ).asJava)

      if (!force) {
        // Check it isn't already locked
        builder.conditionExpression("attribute_not_exists(lockStatus.email)")
      }

      builder.build()
    }

    update(request)
  }

  // Removes the lockStatus attribute if the user currently has it locked
  def unlockTest(testName: String, channel: Channel, email: String): ZIO[ZEnv, DynamoError, Unit] = {
    val request = UpdateItemRequest
      .builder
      .tableName(tableName)
      .key(buildKey(channel, testName))
      .updateExpression("remove lockStatus")
      .conditionExpression("lockStatus.email = :email")
      .expressionAttributeValues(Map(
        ":email" -> AttributeValue.builder.s(email).build
      ).asJava)
      .build()

    update(request)
  }

  def deleteTests(testNames: List[String], channel: Channel): ZIO[ZEnv, DynamoPutError, Unit] = {
    val deleteRequests = testNames.map { testName =>
      WriteRequest
        .builder
        .deleteRequest(
          DeleteRequest
            .builder
            .key(buildKey(channel, testName))
            .build()
        )
        .build()
    }

    logger.info(s"About to batch delete: $deleteRequests")
    putAllBatched(deleteRequests)
  }

  // Set `priority` attribute based on the ordering of the List
  def setPriorities(testNames: List[String], channel: Channel): ZIO[ZEnv, DynamoError, Unit] = {
    val items = testNames.zipWithIndex.map { case (testName, priority) =>
      TransactWriteItem
        .builder
        .update(
          Update
            .builder
            .tableName(tableName)
            .key(buildKey(channel, testName))
            .expressionAttributeValues(Map(
              ":priority" -> AttributeValue.builder.n(priority.toString).build,
              ":name" -> AttributeValue.builder.s(testName).build
            ).asJava)
            .expressionAttributeNames(Map("#name" -> "name").asJava)
            .updateExpression("SET priority = :priority")
            .conditionExpression("#name = :name") // only update if it already exists in the table
            .build()
        )
        .build()
    }
    putAllBatchedTransaction(items)
  }

  def updateStatuses(testNames: List[String], channel: Channel, status: Status): ZIO[ZEnv, DynamoError, Unit] = {
    val items = testNames.map { testName =>
      TransactWriteItem
        .builder
        .update(
          Update
            .builder
            .tableName(tableName)
            .key(buildKey(channel, testName))
            .expressionAttributeValues(Map(
              ":status" -> AttributeValue.builder.s(status.toString).build,
              ":name" -> AttributeValue.builder.s(testName).build
            ).asJava)
            .expressionAttributeNames(Map(
              "#status" -> "status",
              "#name" -> "name"
            ).asJava)
            .updateExpression("SET #status = :status")
            .conditionExpression("#name = :name") // only update if it already exists in the table
            .build()
        )
        .build()
    }
    putAllBatchedTransaction(items)
  }
}
