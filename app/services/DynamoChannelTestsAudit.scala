package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder}
import models.ChannelTest
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, _}
import zio.ZIO
import models.DynamoErrors._
import DynamoChannelTestsAudit.{ChannelTestAudit, getTimeToLive}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}

import java.time.OffsetDateTime
import scala.jdk.CollectionConverters.{ListHasAsScala, MapHasAsJava}
import zio.ZIO.attemptBlocking

object DynamoChannelTestsAudit {
  // The model that we write to the audit table
  case class ChannelTestAudit[T: Encoder: Decoder](
      channelAndName: String, // The partition key is the channel and test name combined
      timestamp: OffsetDateTime, // The range key is the timestamp of the change
      ttlInSecondsSinceEpoch: Long, // Expiry time in seconds since Epoch
      userEmail: String, // The email address of the user making the change
      item: T // The new state of the item being changed
  )

  implicit def encoder[T: Encoder: Decoder]: Encoder[ChannelTestAudit[T]] = deriveEncoder[ChannelTestAudit[T]]
  implicit def decoder[T: Encoder: Decoder]: Decoder[ChannelTestAudit[T]] = deriveDecoder[ChannelTestAudit[T]]

  private val RetentionPeriodInYears = 1
  def getTimeToLive(timestamp: OffsetDateTime): OffsetDateTime = timestamp.plusYears(RetentionPeriodInYears)
}

class DynamoChannelTestsAudit(stage: String, client: DynamoDbClient)
    extends DynamoService(stage, client)
    with StrictLogging {
  protected val tableName = s"support-admin-console-channel-tests-audit-$stage"

  private def getAuditsFromDynamo(
      channelAndName: String
  ): ZIO[Any, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    attemptBlocking {
      client
        .query(
          QueryRequest.builder
            .tableName(tableName)
            .keyConditionExpression("channelAndName = :channelAndName")
            .expressionAttributeValues(
              Map(
                ":channelAndName" -> AttributeValue.builder.s(channelAndName).build
              ).asJava
            )
            .build()
        )
        .items
    }.mapError(DynamoGetError)

  def createAudit[T <: ChannelTest[T]: Encoder: Decoder](test: T, userEmail: String): ZIO[Any, DynamoError, Unit] = {
    val channelAndName = s"${test.channel.get}_${test.name}"
    val timestamp = OffsetDateTime.now()
    val ttlInSecondsSinceEpoch = getTimeToLive(timestamp).toInstant.getEpochSecond

    val audit = ChannelTestAudit(
      channelAndName,
      timestamp,
      ttlInSecondsSinceEpoch,
      userEmail,
      item = test
    )

    val request = PutItemRequest.builder
      .tableName(tableName)
      .item(
        jsonToDynamo(audit.asJson).m()
      )
      .build()

    put(request)
  }

  // Batch write many audits
  def createAudits[T <: ChannelTest[T]: Encoder: Decoder](
      tests: List[T],
      userEmail: String
  ): ZIO[Any, DynamoPutError, Unit] = {
    val timestamp = OffsetDateTime.now()
    val ttlInSecondsSinceEpoch = getTimeToLive(timestamp).toInstant.getEpochSecond

    val writeRequests = tests.map { test =>
      val channelAndName = s"${test.channel.get}_${test.name}"
      val audit = ChannelTestAudit(
        channelAndName,
        timestamp,
        ttlInSecondsSinceEpoch,
        userEmail,
        item = test
      )
      val item = jsonToDynamo(audit.asJson).m()
      WriteRequest.builder
        .putRequest(
          PutRequest.builder
            .item(item)
            .build()
        )
        .build()
    }

    putAllBatched(writeRequests)
  }

  def getAuditsForChannelTest(
      channel: String,
      name: String
  ): ZIO[Any, DynamoError, List[ChannelTestAudit[ChannelTest[_]]]] = {
    val channelAndName = s"${channel}_$name"

    getAuditsFromDynamo(channelAndName).map { results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[ChannelTestAudit[ChannelTest[_]]])
        .flatMap {
          case Right(audit) => Some(audit)
          case Left(error)  =>
            logger.error(s"Failed to decode audit item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.timestamp)
    }
  }
}
