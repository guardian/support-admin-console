package utils

import io.circe.{Decoder, Json, JsonObject, Printer}
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

import scala.jdk.CollectionConverters._

object Circe {
  def decodeStringAndCollect[T](pf: PartialFunction[String, T]): Decoder[T] = Decoder.decodeString.emap { s =>
    pf.lift(s)
      .map(Right.apply)
      .getOrElse(Left(s"Unexpected value: $s"))
  }

  private val printer = Printer.spaces2.copy(dropNullValues = true)
  def noNulls(json: Json): String = printer.print(json)

  // Converts Circe Json to Dynamodb Attributes
  def jsonToDynamo(json: Json): AttributeValue =
    json.fold(
      jsonNull = AttributeValue.builder().nul(true).build,
      jsonBoolean = bool => AttributeValue.builder.bool(bool).build,
      jsonNumber = n => AttributeValue.builder.n(n.toString).build,
      jsonString = s => AttributeValue.builder.s(s).build,
      jsonArray = arr => AttributeValue.builder.l(arr.map(jsonToDynamo).asJava).build,
      jsonObject = obj => {
        val map = obj.toMap.view.mapValues(jsonToDynamo).toMap
        AttributeValue.builder.m(map.asJava).build
      }
    )

  // Converts Dynamodb Attributes to Circe Json
  def dynamoToJson(attribute: AttributeValue): Json = {
    if (attribute.hasM()) {
      // Map
      dynamoMapToJson(attribute.m())
    } else if (attribute.hasL()) {
      // List
      Json.fromValues(attribute.l().asScala.map(dynamoToJson))
    } else if (attribute.hasSs()) {
      // Set of strings
      Json.fromValues(attribute.ss().asScala.map(Json.fromString))
    } else if (attribute.s() != null) {
      // String
      Json.fromString(attribute.s())
    } else if (attribute.n() != null) {
      // Number
      Json.fromDouble(attribute.n().toDouble).getOrElse(Json.Null)
    } else if (attribute.bool() != null) {
      // Bool
      Json.fromBoolean(attribute.bool())
    } else {
      Json.Null
    }
  }

  def dynamoMapToJson(item: java.util.Map[String, AttributeValue]): Json = {
    val jsonMap: Map[String, Json] = item.asScala.view
      .mapValues(dynamoToJson)
      .toMap

    Json.fromJsonObject(JsonObject.fromMap(jsonMap))
  }
}
