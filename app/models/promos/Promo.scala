package models.promos

import com.gu.i18n.Country

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
  endTimestamp: String,
  description: Option[String],
  // TODO - landing page config for print products
)
