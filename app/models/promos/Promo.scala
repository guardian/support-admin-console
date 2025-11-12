package models.promos

import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._
import models.LockStatus

case class AppliesTo(
    productRatePlanIds: Set[String],
    countryGroups: Set[String]
)

object AppliesTo {
  implicit val decoder: Decoder[AppliesTo] = deriveDecoder[AppliesTo]
  implicit val encoder: Encoder[AppliesTo] = deriveEncoder[AppliesTo]
}

case class Promo(
    promoCode: String,
    name: String,
    campaignCode: String,
    appliesTo: AppliesTo,
    startTimestamp: String,
    endTimestamp: Option[String],
    description: Option[String],
    lockStatus: Option[LockStatus],
    discount: Option[DiscountDetails],
    landingPage: Option[PromoLandingPage]
)

object Promo {
  implicit val decoder: Decoder[Promo] = deriveDecoder[Promo]
  implicit val encoder: Encoder[Promo] = deriveEncoder[Promo]
}
