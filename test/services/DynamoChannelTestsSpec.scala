package services

import models.{ArticlesViewedSettings, Channel, EpicTest, MaxViews, Status}
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers
import software.amazon.awssdk.auth.credentials.{AwsBasicCredentials, StaticCredentialsProvider}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import models.EpicTest._
import org.scalatest.{Assertion, Assertions, BeforeAndAfterEach}
import models.DynamoErrors.{DynamoError, DynamoNoLockError}
import software.amazon.awssdk.services.dynamodb.model.{AttributeDefinition, BillingMode, CreateTableRequest, DeleteTableRequest, KeySchemaElement, KeyType}
import zio.{ZEnv, ZIO}

import java.net.URI
import scala.concurrent.Future

class DynamoChannelTestsSpec extends AsyncFlatSpec with Matchers with BeforeAndAfterEach {
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
  private val tableName = s"support-admin-console-channel-tests-$stage"

  def buildEpic(name: String, priority: Option[Int] = None): EpicTest =
    EpicTest(
      name = name,
      nickname = Some(name),
      status = Some(Status.Live),
      channel = Some(Channel.Epic),
      lockStatus = None,
      priority = priority,
      maxViews = None,
      variants = Nil
    )

  val epicTests = List(
    buildEpic("test1", Some(0)),
    buildEpic("test2", Some(1))
  )

  // Check if the program succeeds and run `assert` against the result value
  def expectToSucceedWith[T](program: ZIO[ZEnv, DynamoError, T])(assert: T => Assertion): Future[Assertion] =
    runtime.unsafeRunToFuture(program.map(assert))

  // Check if the program fails and run `assert` against the error
  def expectToFailWith[T](program: ZIO[ZEnv, DynamoError, T])(assert: PartialFunction[DynamoError, Assertion]): Future[Assertion] =
    runtime.unsafeRunToFuture {
      program
        .map(result => Assertions.fail(s"Expected an error, but got $result"))
        .catchSome(assert.andThen(assertionResult => ZIO.succeed(assertionResult)))
    }

  override def beforeEach(): Unit = {
    // Create a channel-tests table
    client.createTable(
      CreateTableRequest
        .builder
        .tableName(tableName)
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
  }

  override def afterEach(): Unit = {
    // Drop the table for the next test
    client.deleteTable(DeleteTableRequest.builder.tableName(tableName).build)
  }

  it should "create and then fetch epic tests" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createOrUpdateTests(epicTests, Channel.Epic)
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests
    }(tests => tests should be(epicTests))
  }

  it should "create and then delete epic tests" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createOrUpdateTests(epicTests, Channel.Epic)
        _ <- dynamo.deleteTests(epicTests.map(_.name), Channel.Epic)
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests
    }(tests => tests should be(Nil))
  }

  it should "create a new test with bottom priority" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createOrUpdateTests(epicTests, Channel.Epic)
        _ <- dynamo.createTest(buildEpic("test3"), Channel.Epic) // should create with priority of 2
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests(2)
    }(test => test.priority should be(Some(2)))
  }

  it should "lock a test if not already locked" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createTest(buildEpic("test1"), Channel.Epic)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me@me.com", force = false)
      } yield ()
    }(_ => succeed)
  }

  it should "fail to lock a test if already locked (DynamoNoLockError)" in {
    expectToFailWith {
      for {
        _ <- dynamo.createTest(buildEpic("test1"), Channel.Epic)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me1@me.com", force = false)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me2@me.com", force = false) // should fail
      } yield ()
    } { case DynamoNoLockError(_) => Assertions.succeed }
  }

  it should "force lock a test if already locked" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createTest(buildEpic("test1"), Channel.Epic)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me1@me.com", force = false)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me2@me.com", force = true)
      } yield ()
    }(_ => succeed)
  }

  it should "update a test if locked by user" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createTest(buildEpic("test1"), Channel.Epic)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me1@me.com", force = false)
        _ <- dynamo.updateTest(buildEpic("test1").copy(nickname = Some("new nickname")), Channel.Epic, "me1@me.com")
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests.head
    }(test => test.nickname should be(Some("new nickname")))
  }

  it should "fail to update a test if not locked by user (DynamoNoLockError)" in {
    expectToFailWith {
      for {
        _ <- dynamo.createTest(buildEpic("test1"), Channel.Epic)
        _ <- dynamo.updateTest(buildEpic("test1").copy(nickname = Some("new nickname")), Channel.Epic, "me1@me.com")
      } yield ()
    } { case DynamoNoLockError(_) => Assertions.succeed }
  }

  it should "update test priorities" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createOrUpdateTests(epicTests, Channel.Epic)
        _ <- dynamo.setPriorities(List("test2", "test1"), Channel.Epic) //swap the priorities
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests
    }(tests => tests.map(_.name) should be(List("test2", "test1")))
  }

  it should "archive a test" in {
    expectToSucceedWith {
      for {
        _ <- dynamo.createOrUpdateTests(epicTests, Channel.Epic)
        _ <- dynamo.updateStatuses(List("test2"), Channel.Epic, Status.Archived)
        tests <- dynamo.getAllTests(Channel.Epic) // excludes archived tests
      } yield tests
    }(tests => tests.map(_.name) should be(List("test1")))
  }

  it should "update a test and remove unset fields" in {
    val withFieldsSet = buildEpic("test1").copy(
      maxViews = Some(MaxViews(1,2,3)),
      articlesViewedSettings = Some(ArticlesViewedSettings(Some(1),Some(2),3))
    )
    val withFieldsUnset = buildEpic("test1").copy(
      maxViews = None,  // top-level null
      articlesViewedSettings = Some(ArticlesViewedSettings(None, None, 3))  // nested nulls
    )
    expectToSucceedWith {
      for {
        _ <- dynamo.createTest(withFieldsSet, Channel.Epic)
        _ <- dynamo.lockTest("test1", Channel.Epic, "me1@me.com", force = false)
        _ <- dynamo.updateTest(withFieldsUnset, Channel.Epic, "me1@me.com")
        tests <- dynamo.getAllTests(Channel.Epic)
      } yield tests.head
    }(test => {
      test.maxViews should be(None)
      test.articlesViewedSettings should be(Some(ArticlesViewedSettings(None, None, 3)))
    })
  }
}
