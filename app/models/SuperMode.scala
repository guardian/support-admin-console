package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._

case class SuperModeRow(url: String, region: String, startTimestamp: String, endTimestamp: String, avPerView: Double)

object SuperModeRow {
  implicit val encoder = Encoder[SuperModeRow]
  implicit val decoder = Decoder[SuperModeRow]
}
