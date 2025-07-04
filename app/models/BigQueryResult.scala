package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

case class BigQueryResult(
    test_name: String,
    variant_name: String,
    component_type: String,
    ltv3: Double
)
object BigQueryResult {
  implicit val decoder: Decoder[BigQueryResult] = deriveDecoder
  implicit val encoder: Encoder[BigQueryResult] = deriveEncoder
}
