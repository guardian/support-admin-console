package migration

import models.{Channel, ChannelTest, LockStatus, Status}
import services.DynamoChannelTests
import org.scalatest.flatspec.AnyFlatSpec
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, UpdateItemRequest}
import zio.ZIO
import io.circe.generic.auto._

import scala.concurrent.Await
import scala.concurrent.duration.DurationInt
import scala.jdk.CollectionConverters._

class SetStatus extends AnyFlatSpec {
  private val stage = "DEV"
  private val runtime = zio.Runtime.default
  private val tableName = s"support-admin-console-channel-tests-$stage"
  private val channels: List[Channel] = List(Channel.Header, Channel.Epic, Channel.EpicAMP, Channel.EpicHoldback, Channel.EpicLiveblog, Channel.EpicAppleNews, Channel.Banner1, Channel.Banner2)
  case class GeneralTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    isOn: Boolean,
  ) extends ChannelTest[GeneralTest] {
    def withChannel(channel: Channel) = this
    def withPriority(priority: Int) = this
  }

  private val dynamo = new DynamoChannelTests(stage)

  it should "set the status attribute" in {
    val future = runtime.unsafeRunToFuture {
      ZIO
        .collectAll(channels.map(channel => dynamo.getAllTests[GeneralTest](channel)))
        .map(lists => lists.flatten)
        .flatMap(tests => {
          val updatedTests = tests.map(test => {
            val status = if (test.isOn) models.Status.Live else models.Status.Draft
            test.copy(status = Some(status))
          })

          ZIO.collectAll {
            updatedTests.map(test => {
              val request = UpdateItemRequest
                .builder
                .tableName(tableName)
                .key(
                  Map(
                    "channel" -> AttributeValue.builder.s(test.channel.get.toString).build,
                    "name" -> AttributeValue.builder.s(test.name).build
                  ).asJava
                )
                .updateExpression("set #status = :status")
                .expressionAttributeValues(Map(
                  ":status" -> AttributeValue.builder.s(test.status.get.toString).build
                ).asJava)
                .expressionAttributeNames(Map("#status" -> "status").asJava)
                .build()

              println(request)
              dynamo.update(request)
            })
          }
        })
        .map(_ => println("done"))
    }

    Await.result(future, 20.seconds)
  }
}
