package models.promos

import com.gu.i18n.Country
import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._

case class AppliesTo(
    productRatePlanIds: Set[String],
    countries: Set[Country]
)

object AppliesTo {
  implicit val countryDecoder: Decoder[Country] = deriveDecoder[Country]
  implicit val countryEncoder: Encoder[Country] = deriveEncoder[Country]
  implicit val decoder: Decoder[AppliesTo] = deriveDecoder[AppliesTo]
  implicit val encoder: Encoder[AppliesTo] = deriveEncoder[AppliesTo]
}

case class Promo(
    promoCode: String,
    name: String,
    campaignCode: String,
    appliesTo: AppliesTo,
    startTimestamp: String,
    endTimestamp: String,
    description: Option[String]
    // TODO - landing page config for print products
)

object Promo {
  implicit val decoder: Decoder[Promo] = deriveDecoder[Promo]
  implicit val encoder: Encoder[Promo] = deriveEncoder[Promo]
}
