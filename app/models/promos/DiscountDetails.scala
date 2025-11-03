package models.promos

import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._

case class DiscountDetails(
    durationMonths: Int,
    amount: Double
)

object DiscountDetails {
  implicit val decoder: Decoder[DiscountDetails] = deriveDecoder[DiscountDetails]
  implicit val encoder: Encoder[DiscountDetails] = deriveEncoder[DiscountDetails]
}
