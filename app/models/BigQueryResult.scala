package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}

import java.time.LocalDate

case class BigQueryResult(
                           test_name: String,
                           variant_name: String,
                           component_type: String,
                           acquisition_ltv_3_year: Double,
                         )
object BigQueryResult {
  implicit val decoder: Decoder[BigQueryResult] = deriveDecoder
  implicit val encoder: Encoder[BigQueryResult] = deriveEncoder
}