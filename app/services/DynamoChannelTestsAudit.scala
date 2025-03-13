package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.syntax.EncoderOps
import io.circe.{Decoder, Encoder}
import models.ChannelTest
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import zio.{ZEnv, ZIO}
import models.DynamoErrors._
import services.DynamoChannelTestsAudit.{ChannelTestAudit, getTimeToLive}
import utils.Circe.jsonToDynamo

import java.time.OffsetDateTime

object DynamoChannelTestsAudit {
  // The model that we write to the audit table
  case class ChannelTestAudit[T <: ChannelTest[T] : Encoder : Decoder](
    channelAndName: String,       // The partition key is the channel and test name combined
    timestamp: OffsetDateTime,    // The range key is the timestamp of the change
    ttlInSecondsSinceEpoch: Long, // Expiry time in seconds since Epoch
    userEmail: String,            // The email address of the user making the change
    item: T                       // The new state of the item being changed
  )

  implicit def encoder[T <: ChannelTest[T] : Encoder : Decoder] = deriveEncoder[ChannelTestAudit[T]]
  implicit def decoder[T <: ChannelTest[T] : Encoder : Decoder] = deriveDecoder[ChannelTestAudit[T]]

  private val RetentionPeriodInYears = 1
  def getTimeToLive(timestamp: OffsetDateTime): OffsetDateTime = timestamp.plusYears(RetentionPeriodInYears)
}

class DynamoChannelTestsAudit(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {
  protected val tableName = s"support-admin-console-channel-tests-audit-$stage"

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
}
