package services

import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import models.{ChannelTest, Status}
import utils.Circe.{dynamoMapToJson, jsonToDynamo}

import scala.jdk.CollectionConverters._

object DynamoChannelTests {
  def getAllTests[T <: ChannelTest : Decoder](tableName: String, statuses: List[Status]): List[T] =
    // We have to do a separate query for each status, because dynamo's KeyConditionExpression only supports equality operator
    statuses.flatMap { status =>
      Dynamo.getAll(tableName, status).asScala
        .map(item => dynamoMapToJson(item).as[T])
        .flatMap {
          case Right(test) => Some(test)
          case Left(error) =>
            println(error)
            None
        }
        .toList
        .sortBy(_.priority)
    }

  def createOrUpdateTest[T : Encoder](tableName: String, t: T) =
    Dynamo.put(
      tableName,
      jsonToDynamo(t.asJson).m()
    )
}
