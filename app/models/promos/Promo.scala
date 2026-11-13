package models.promos

import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._
import models.LockStatus

case class AppliesTo(
    productRatePlanIds: Set[String],
    countries: Option[Set[String]],
    countryGroups: Option[Set[String]] = None
)

object AppliesTo {
  implicit val decoder: Decoder[AppliesTo] = deriveDecoder[AppliesTo].ensure(
    targeting =>
      (targeting.countries.isDefined || targeting.countryGroups.isDefined) &&
        targeting.countryGroups.forall(_.subsetOf(PromoCountryGroups.ids)),
    "Expected countries or valid promotion country groups"
  )
  implicit val encoder: Encoder.AsObject[AppliesTo] = deriveEncoder[AppliesTo].mapJsonObject { fields =>
    fields.filter { case (_, value) => !value.isNull }
  }
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
    landingPage: Option[PromoLandingPage],
    isIntroductoryPricing: Option[Boolean]
)

object Promo {
  implicit val decoder: Decoder[Promo] = deriveDecoder[Promo]
  implicit val encoder: Encoder[Promo] = deriveEncoder[Promo]
}
