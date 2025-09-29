package models.promos

case class Pricing(
  aud: Option[Double] = None,
  cad: Option[Double] = None,
  eur: Option[Double] = None,
  gbp: Option[Double] = None,
  nzd: Option[Double] = None,
  usd: Option[Double] = None
)

case class Charge(id: String)
case class Charges(items: Map[String, Charge])

case class RatePlan(
  billingPeriod: String,
  charges: Charges,
  id: String,
  pricing: Pricing,
  termLengthInMonths: Int,
  termType: String
)

case class GuardianWeeklyDomestic(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class GuardianWeeklyRestOfWorld(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class HomeDelivery(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class NationalDelivery(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class SubscriptionCard(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class SupporterPlus(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)

case class TierThree(
  customerFacingName: String,
  ratePlans: Map[String, RatePlan]
)
