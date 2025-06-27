package services

import com.typesafe.scalalogging.StrictLogging
import models.DynamoErrors.{DynamoDuplicateNameError, DynamoError, DynamoPutError}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, ConditionalCheckFailedException, PutItemRequest}
import zio.{ZEnv, ZIO}

import java.text.SimpleDateFormat
import java.util
import java.util.Date

class DynamoArchivedBannerDesigns(stage: String, client: DynamoDbClient) extends DynamoService(stage, client) with StrictLogging {

  protected val tableName = s"support-admin-console-archived-banner-designs-$stage"

  def putRaw(item: java.util.Map[String, AttributeValue]): ZIO[ZEnv, DynamoError, Unit] = {
    // Add date attribute, which is the sort key. We first have to build a mutable Map, otherwise the Java Map throws when we insert
    val mutableItem = new util.HashMap(item)
    val date = new SimpleDateFormat("yyyy-MM-dd").format(new Date())
    mutableItem.put("date", AttributeValue.builder.s(date).build())

    put(
      PutItemRequest
        .builder
        .tableName(tableName)
        .item(mutableItem)
        .build()
    )
  }
}
