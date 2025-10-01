package models.promos

import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._

case class PromoCampaign(
  campaignCode: String,
  product: PromoProduct,
  name: String,
  created: String
)
object PromoCampaign {
  implicit val decoder: Decoder[PromoCampaign] = deriveDecoder[PromoCampaign]
  implicit val encoder: Encoder[PromoCampaign] = deriveEncoder[PromoCampaign]
}