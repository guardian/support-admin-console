package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors._
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model._
import zio.ZIO

class DynamoArchivedChannelTests(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-archived-channel-tests-$stage"

  def putAllRaw(items: List[java.util.Map[String, AttributeValue]]): ZIO[Any, DynamoPutError, Unit] = {
    val writeRequests = items.map(item => WriteRequest.builder.putRequest(
      PutRequest
        .builder
        .item(item)
        .build()
    ).build())

    putAllBatched(writeRequests)
  }
}
