package services

import models.{Channel, EpicTest, Status}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.auth.credentials.{AwsBasicCredentials, StaticCredentialsProvider}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import models.EpicTest._
import software.amazon.awssdk.services.dynamodb.model.{AttributeDefinition, BillingMode, CreateTableRequest, KeySchemaElement, KeyType}

import java.net.URI

class DynamoChannelTestsSpec extends AsyncFlatSpec with Matchers {
  private val stage = "TEST"
  private val runtime = zio.Runtime.default

  // Use a local instance of dynamodb, available via the sbt-dynamodb plugin
  private val client = DynamoDbClient
    .builder
    .region(Aws.region)
    .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create("id", "secret")))
    .endpointOverride(new URI("http://localhost:8083"))
    .build

  private val dynamo = new DynamoChannelTests(stage, client)

  // Create a channel-tests table
  client.createTable(
    CreateTableRequest
      .builder
      .tableName(s"support-admin-console-channel-tests-$stage")
      .attributeDefinitions(
        AttributeDefinition.builder.attributeName("channel").attributeType("S").build,
        AttributeDefinition.builder.attributeName("name").attributeType("S").build
      )
      .keySchema(
        KeySchemaElement.builder.attributeName("channel").keyType(KeyType.HASH).build,
        KeySchemaElement.builder.attributeName("name").keyType(KeyType.RANGE).build
      )
      .billingMode(BillingMode.PAY_PER_REQUEST)
      .build
  )

  def buildEpic(name: String, priority: Int): EpicTest =
    EpicTest(
      name = name,
      nickname = Some(name),
      isOn = true,
      status = Some(Status.Live),
      channel = Some(Channel.Epic),
      lockStatus = None,
      priority = Some(priority),
      maxViews = None,
      variants = Nil
    )

  val epicTests = List(
    buildEpic("test1", 0),
    buildEpic("test2", 1)
  )

  it should "create and then fetch epic tests" in {
    val result = runtime.unsafeRunToFuture {
      for {
        _ <- dynamo.replaceChannelTests(epicTests, Channel.Epic)
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests

    }
    result.map(tests => tests should be(epicTests))
  }

  it should "create and then delete epic tests" in {
    val result = runtime.unsafeRunToFuture {
      for {
        _ <- dynamo.replaceChannelTests(epicTests, Channel.Epic)
        _ <- dynamo.deleteTests(epicTests.map(_.name), Channel.Epic)
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests

    }
    result.map(tests => tests should be(Nil))
  }
}
