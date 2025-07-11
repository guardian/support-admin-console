package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class SuperModeRow(
    url: String,
    region: String,
    startTimestamp: String,
    endTimestamp: String,
    avPerView: Double,
    totalAv: Double,
    totalViews: Double,
    totalAcquisitions: Option[Double]
)

object SuperModeRow {
  implicit val encoder: Encoder[SuperModeRow] = deriveEncoder[SuperModeRow]
  implicit val decoder: Decoder[SuperModeRow] = deriveDecoder[SuperModeRow]
}
