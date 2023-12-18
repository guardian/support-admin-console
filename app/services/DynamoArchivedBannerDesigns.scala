package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoPutError}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ConditionalCheckFailedException, PutItemRequest}
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

class DynamoArchivedBannerDesigns(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-archived-banner-designs-$stage"

  private def put(putRequest: PutItemRequest): ZIO[ZEnv, DynamoError, Unit] =
    effectBlocking {
      val result = client.putItem(putRequest)
      logger.info(s"PutItemResponse: $result")
      ()
    }.mapError {
      case err: ConditionalCheckFailedException => DynamoDuplicateNameError(err)
      case other => DynamoPutError(other)
    }

  def putRaw(item: java.util.Map[String, AttributeValue]): ZIO[ZEnv, DynamoError, Unit] =
    put(
      PutItemRequest
        .builder
        .item(item)
        .build()
    )
}
