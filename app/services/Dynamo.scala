package services

import io.circe.{Decoder, Encoder}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, BatchExecuteStatementRequest, PutItemRequest, QueryRequest, ScanRequest}
import utils.Circe._
import io.circe.syntax._
import models.{Live, Status}

import scala.jdk.CollectionConverters._

object Dynamo {
  private val client = DynamoDbClient
    .builder
    .region(Aws.region)
    .credentialsProvider(Aws.credentialsProvider.build)
    .build

  def getAll(tableName: String, status: Status): java.util.List[java.util.Map[String, AttributeValue]] = {
    client.query(
      QueryRequest
        .builder
        .tableName(tableName)
        .indexName("status-index")
        .keyConditionExpression("#s = :status")
        .expressionAttributeNames(Map("#s" -> "status").asJava) // status is a keyword in dynamo, so we have to rename it here!
        .expressionAttributeValues(Map(":status" -> AttributeValue.builder.s(status.name).build).asJava)
        .build()
    ).items
  }

  def put(tableName: String, item: java.util.Map[String, AttributeValue]): Unit = {
    println(s"putting: $item")
    val result = client.putItem(
      PutItemRequest
        .builder
        .item(item)
        .tableName(tableName)
        .build()
    )
    // TODO - error checking
    println(s"result: $result")
  }
}
