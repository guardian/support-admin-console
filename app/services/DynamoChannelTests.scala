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
import zio._

import java.time.OffsetDateTime
import scala.jdk.CollectionConverters._
import zio.ZIO.attemptBlocking

class DynamoChannelTests(stage: String, client: DynamoDbClient)
    extends DynamoService(stage, client)
    with StrictLogging {

  protected val tableName = s"support-admin-console-channel-tests-$stage"
  private val campaignNameIndex = "campaignName-name-index"

  private def buildKey(channel: Channel, testName: String): java.util.Map[String, AttributeValue] =
    Map(
      "channel" -> AttributeValue.builder.s(channel.toString).build,
      "name" -> AttributeValue.builder.s(testName).build
    ).asJava

  /** Attempts to retrieve a test from dynamodb. Fails if the test does not exist.
    */
  private def get(testName: String, channel: Channel): ZIO[Any, DynamoGetError, java.util.Map[String, AttributeValue]] =
    attemptBlocking {
      val query = QueryRequest.builder
        .tableName(tableName)
        .keyConditionExpression("channel = :channel AND #name = :name")
        .expressionAttributeValues(
          Map(
            ":channel" -> AttributeValue.builder.s(channel.toString).build,
            ":name" -> AttributeValue.builder.s(testName).build
          ).asJava
        )
        .expressionAttributeNames(Map("#name" -> "name").asJava) // name is a reserved word in dynamodb
        .build()

      client
        .query(query)
        .items
        .asScala
        .headOption

    }.flatMap {
      case Some(item) => ZIO.succeed(item)
      case None       => ZIO.fail(DynamoGetError(new Exception(s"Test does not exist: $channel/$testName")))
    }.mapError(error => DynamoGetError(error))

  private def getAll(
      channel: Channel
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("channel = :channel")
            .expressionAttributeValues(
              Map(
                ":channel" -> AttributeValue.builder.s(channel.toString).build,
                ":archived" -> AttributeValue.builder.s("Archived").build
              ).asJava
            )
            .expressionAttributeNames(
              Map(
                "#status" -> "status"
              ).asJava
            )
            .filterExpression("#status <> :archived")
            .build()
        )
        .items
    }.mapError(DynamoGetError)

  private def getAllInCampaign(
      campaignName: String
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("campaignName = :campaignName")
            .indexName(campaignNameIndex)
            .expressionAttributeValues(
              Map(
                ":campaignName" -> AttributeValue.builder.s(campaignName).build
              ).asJava
            )
            .build()
        )
        .items
    }.mapError(DynamoGetError)

  private def update(updateRequest: UpdateItemRequest): ZIO[Any, DynamoError, Unit] =
    attemptBlocking {
      val result = client.updateItem(updateRequest)
      logger.info(s"UpdateItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoNoLockError(err)
      case other                                => DynamoPutError(other)
    }

  def getTest[T <: ChannelTest[T]: Decoder](testName: String, channel: Channel): ZIO[Any, DynamoGetError, T] =
    get(testName, channel)
      .map(item => dynamoMapToJson(item).as[T])
      .flatMap {
        case Right(test) => ZIO.succeed(test)
        case Left(error) => ZIO.fail(DynamoGetError(error))
      }

  def getAllTests[T <: ChannelTest[T]: Decoder](channel: Channel): ZIO[Any, DynamoGetError, List[T]] =
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
  def getRawTests(
      channel: Channel,
      testNames: List[String]
  ): ZIO[Any, DynamoGetError, List[java.util.Map[String, AttributeValue]]] = {
    // Build a batch item request
    val items = testNames.map(testName => buildKey(channel, testName))
    val keysAndAttributes = KeysAndAttributes.builder().keys(items.asJava).build()

    val request = BatchGetItemRequest
      .builder()
      .requestItems(Map(tableName -> keysAndAttributes).asJava)
      .build()

    attemptBlocking {
      client
        .batchGetItem(request)
        .responses()
        .asScala
        .get(tableName)
        .map(_.asScala.toList)
        .getOrElse(Nil)
    }.mapError(DynamoGetError)
  }

  def getTests[T <: ChannelTest[T]: Decoder](
      channel: Channel,
      testNames: List[String]
  ): ZIO[Any, DynamoGetError, List[T]] = {
    getRawTests(channel, testNames).map(rawTests => {
      rawTests.flatMap(rawTest =>
        dynamoMapToJson(rawTest).as[T] match {
          case Right(test) => Some(test)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
      )
    })
  }

  // Returns all tests in a campaign, sorted by channel
  import models.ChannelTest.channelTestDecoder
  def getAllTestsInCampaign(campaignName: String): ZIO[Any, DynamoGetError, List[ChannelTest[_]]] =
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

  def createOrUpdateTests[T <: ChannelTest[T]: Encoder](
      tests: List[T],
      channel: Channel
  ): ZIO[Any, DynamoPutError, Unit] = {
    val writeRequests = tests.zipWithIndex.map { case (test, priority) =>
      // Add the priority and channel fields, which we don't have in S3
      val prioritised = test.withPriority(priority).withChannel(channel)
      val item = jsonToDynamo(prioritised.asJson).m()
      WriteRequest.builder
        .putRequest(
          PutRequest.builder
            .item(item)
            .build()
        )
        .build()
    }
    logger.info(s"About to batch put: $writeRequests")

    putAllBatched(writeRequests)
  }

  /** With an UpdateItem request we have to provide an expression to specify each attribute to be updated. We do this by
    * iterating over the attributes in `item` and building an expression
    */
  private def buildUpdateTestExpression(item: Map[String, AttributeValue]): String = {
    val subExprs = item.foldLeft[List[String]](Nil) { case (acc, (key, value)) =>
      s"$key = :$key" +: acc
    }
    s"set ${subExprs.mkString(", ")} remove lockStatus" // Unlock the test at the same time
  }

  def updateTest[T <: ChannelTest[T]: Encoder](
      test: T,
      channel: Channel,
      email: String
  ): ZIO[Any, DynamoError, Unit] = {
    val item = jsonToDynamo(test.asJson).m().asScala.toMap -
      "status" - // Do not update status - this is a separate action
      "priority" - // Do not update priority - this is a separate action
      "lockStatus" - // Unlock by removing lockStatus
      "name" - // key field
      "channel" // key field

    val updateExpression = buildUpdateTestExpression(item)

    val attributeValues = item.map { case (key, value) => s":$key" -> value }
    // Add email, for the conditional update
    val attributeValuesWithEmail = attributeValues + (":email" -> AttributeValue.builder.s(email).build)

    val updateRequest = UpdateItemRequest.builder
      .tableName(tableName)
      .key(buildKey(channel, test.name))
      .updateExpression(updateExpression)
      .expressionAttributeValues(attributeValuesWithEmail.asJava)
      .conditionExpression("lockStatus.email = :email")
      .build()

    update(updateRequest)
  }

  // Returns the value of the bottom priority test - which is the highest value, because 0 is top priority
  private def getBottomPriority[T <: ChannelTest[T]: Decoder](channel: Channel): ZIO[Any, DynamoError, Int] =
    getAllTests[T](channel)
      .map(allTests => allTests.flatMap(_.priority).maxOption.getOrElse(0))

  // Creates a new test, with bottom priority
  def createTest[T <: ChannelTest[T]: Encoder: Decoder](test: T, channel: Channel): ZIO[Any, DynamoError, T] =
    getBottomPriority[T](channel)
      .flatMap(bottomPriority => {
        val priority = bottomPriority + 1
        val enrichedTest = test.withChannel(channel).withPriority(priority)
        val item = jsonToDynamo(enrichedTest.asJson).m()
        val request = PutItemRequest.builder
          .tableName(tableName)
          .item(item)
          // Do not overwrite if already in dynamo
          .conditionExpression("attribute_not_exists(#name)")
          .expressionAttributeNames(Map("#name" -> "name").asJava)
          .build()

        put(request).map(_ => enrichedTest)
      })

  def lockTest(testName: String, channel: Channel, email: String, force: Boolean): ZIO[Any, DynamoError, Unit] = {
    val lockStatus = LockStatus(
      locked = true,
      email = Some(email),
      timestamp = Some(OffsetDateTime.now())
    )
    val request = {
      val builder = UpdateItemRequest.builder
        .tableName(tableName)
        .key(buildKey(channel, testName))
        .updateExpression("set lockStatus = :lockStatus")
        .expressionAttributeValues(
          Map(
            ":lockStatus" -> jsonToDynamo(lockStatus.asJson)
          ).asJava
        )
        .expressionAttributeNames(Map("#name" -> "name").asJava)

      val itemExistsExpression = "attribute_exists(#name)" // only update if it already exists in the table
      if (!force) {
        // Check it isn't already locked
        builder.conditionExpression(s"$itemExistsExpression and attribute_not_exists(lockStatus.email)")
      } else {
        builder.conditionExpression(itemExistsExpression)
      }

      builder.build()
    }

    update(request)
  }

  // Removes the lockStatus attribute if the user currently has it locked
  def unlockTest(testName: String, channel: Channel, email: String): ZIO[Any, DynamoError, Unit] = {
    val request = UpdateItemRequest.builder
      .tableName(tableName)
      .key(buildKey(channel, testName))
      .updateExpression("remove lockStatus")
      .conditionExpression("lockStatus.email = :email")
      .expressionAttributeValues(
        Map(
          ":email" -> AttributeValue.builder.s(email).build
        ).asJava
      )
      .build()

    update(request)
  }

  def deleteTests(testNames: List[String], channel: Channel): ZIO[Any, DynamoPutError, Unit] = {
    val deleteRequests = testNames.map { testName =>
      WriteRequest.builder
        .deleteRequest(
          DeleteRequest.builder
            .key(buildKey(channel, testName))
            .build()
        )
        .build()
    }

    logger.info(s"About to batch delete: $deleteRequests")
    putAllBatched(deleteRequests)
  }

  // Set `priority` attribute based on the ordering of the List
  def setPriorities(testNames: List[String], channel: Channel): ZIO[Any, DynamoError, Unit] = {
    val items = testNames.zipWithIndex.map { case (testName, priority) =>
      TransactWriteItem.builder
        .update(
          Update.builder
            .tableName(tableName)
            .key(buildKey(channel, testName))
            .expressionAttributeValues(
              Map(
                ":priority" -> AttributeValue.builder.n(priority.toString).build,
                ":name" -> AttributeValue.builder.s(testName).build
              ).asJava
            )
            .expressionAttributeNames(Map("#name" -> "name").asJava)
            .updateExpression("SET priority = :priority")
            .conditionExpression("#name = :name") // only update if it already exists in the table
            .build()
        )
        .build()
    }
    putAllBatchedTransaction(items)
  }

  def updateStatuses(testNames: List[String], channel: Channel, status: Status): ZIO[Any, DynamoError, Unit] = {
    val items = testNames.map { testName =>
      TransactWriteItem.builder
        .update(
          Update.builder
            .tableName(tableName)
            .key(buildKey(channel, testName))
            .expressionAttributeValues(
              Map(
                ":status" -> AttributeValue.builder.s(status.toString).build,
                ":name" -> AttributeValue.builder.s(testName).build
              ).asJava
            )
            .expressionAttributeNames(
              Map(
                "#status" -> "status",
                "#name" -> "name"
              ).asJava
            )
            .updateExpression("SET #status = :status")
            .conditionExpression("#name = :name") // only update if it already exists in the table
            .build()
        )
        .build()
    }
    putAllBatchedTransaction(items)
  }
}
