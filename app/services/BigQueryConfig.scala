package services

import play.api.libs.json.{JsObject, Json}

case class BigQueryConfig(bigQueryCredentials: JsObject)

object BigQueryConfig {
  implicit val bigQueryConfigReads = Json.reads[BigQueryConfig]
}
