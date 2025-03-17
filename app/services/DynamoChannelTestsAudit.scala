package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder}
import models.{Channel, ChannelTest}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, _}
import zio.{ZEnv, ZIO}
import models.DynamoErrors._
import models.ChannelTest._
import DynamoChannelTestsAudit.{ChannelTestAudit, getTimeToLive}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}
import zio.blocking.effectBlocking

import java.time.OffsetDateTime
import scala.jdk.CollectionConverters.{ListHasAsScala, MapHasAsJava}
import models.ChannelTest._

object DynamoChannelTestsAudit {
  // The model that we write to the audit table
  case class ChannelTestAudit[T : Encoder : Decoder](
    channelAndName: String,       // The partition key is the channel and test name combined
    timestamp: OffsetDateTime,    // The range key is the timestamp of the change
    ttlInSecondsSinceEpoch: Long, // Expiry time in seconds since Epoch
    userEmail: String,            // The email address of the user making the change
    item: T                       // The new state of the item being changed
  )

  implicit def encoder[T : Encoder : Decoder] = deriveEncoder[ChannelTestAudit[T]]
  implicit def decoder[T : Encoder : Decoder] = deriveDecoder[ChannelTestAudit[T]]

//  implicit val generalDecoder = Decoder[ChannelTestAudit[ChannelTest[_]]](decoder)
//  implicit val generalEncoder = Encoder[ChannelTestAudit[ChannelTest[_]]](encoder(channelTestEncoder))

//  implicit def generalEncoder = deriveEncoder[ChannelTest[_]]
//  implicit def generalDecoder = deriveDecoder[ChannelTest[_]]

//  implicit def generalAuditEncoder: Encoder[ChannelTestAudit[ChannelTest[_]]] = deriveEncoder[ChannelTestAudit[ChannelTest[_]]]
//  implicit def generalAuditDecoder: Decoder[ChannelTestAudit[ChannelTest[_]]] = deriveDecoder[ChannelTestAudit[ChannelTest[_]]]


  private val RetentionPeriodInYears = 1
  def getTimeToLive(timestamp: OffsetDateTime): OffsetDateTime = timestamp.plusYears(RetentionPeriodInYears)
}

class DynamoChannelTestsAudit(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {
  protected val tableName = s"support-admin-console-channel-tests-audit-$stage"

  private def getAuditsFromDynamo(channelAndName: String): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] =
    effectBlocking {
      client.query(
        QueryRequest
          .builder
          .tableName(tableName)
          .keyConditionExpression("channelAndName = :channelAndName")
          .expressionAttributeValues(Map(
            ":channelAndName" -> AttributeValue.builder.s(channelAndName).build
          ).asJava)
          .build()
      ).items
    }.mapError(DynamoGetError)

  def createAudit[T <: ChannelTest[T] : Encoder : Decoder](test: T, userEmail: String): ZIO[ZEnv, DynamoError, Unit] = {
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

    val request = PutItemRequest
      .builder
      .tableName(tableName)
      .item(
        jsonToDynamo(audit.asJson).m()
      )
      .build()

    put(request)
  }

  // TODO - item needs to be a blob of json
  def getAuditsForChannelTest(channel: String, name: String): ZIO[ZEnv, DynamoError, List[ChannelTestAudit[ChannelTest[_]]]] = {
    val channelAndName = s"${channel}_${name}"

    getAuditsFromDynamo(channelAndName).map { results =>
      results.asScala
        .map(i => {
          println(s"item: $i")
          i
        })
        .map(item => dynamoMapToJson(item).as[ChannelTestAudit[ChannelTest[_]]])
        .flatMap {
          case Right(audit) => Some(audit)
          case Left(error) =>
            logger.error(s"Failed to decode audit item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
        .sortBy(_.timestamp)
    }
  }
}
