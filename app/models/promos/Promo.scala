package models.promos

import com.gu.i18n.Country
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.generic.auto._

case class AppliesTo(
  productRatePlanIds: Set[String],
  countries: Set[Country]
)

case class Promo(
  promoCode: String,
  name: String,
  campaignCode: String,
  appliesTo: AppliesTo,
  startTimestamp: String,
  endTimestamp: Option[String],
  description: Option[String],
  // TODO - landing page config for print products
)

object Promo {
  implicit val decoder: Decoder[Promo] = deriveDecoder[Promo]
  implicit val encoder: Encoder[Promo] = deriveEncoder[Promo]
}
