package models.promos

import io.circe.generic.extras.Configuration
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import ProductCatalog._

case class ProductCatalog(
  GuardianWeeklyDomestic: GuardianWeeklyDomestic,
  GuardianWeeklyRestOfWorld: GuardianWeeklyRestOfWorld,
  HomeDelivery: HomeDelivery,
  SubscriptionCard: SubscriptionCard,
  NationalDelivery: NationalDelivery,
  SupporterPlus: SupporterPlus,
  TierThree: TierThree
)

object ProductCatalog {
  // All currencies here are optional, and the product catalog will define which are available for a given rate plan
  case class Pricing(
    AUD: Option[Double] = None,
    CAD: Option[Double] = None,
    EUR: Option[Double] = None,
    GBP: Option[Double] = None,
    NZD: Option[Double] = None,
    USD: Option[Double] = None
  )

  case class RatePlan(
    billingPeriod: BillingPeriod,
    id: String,
    pricing: Pricing
  )

  sealed trait BillingPeriod
  object BillingPeriod {
    case object Month extends BillingPeriod
    case object Annual extends BillingPeriod
    case object Quarter extends BillingPeriod

    import io.circe.generic.extras.semiauto._
    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val encoder: Encoder[BillingPeriod] = deriveEnumerationEncoder[BillingPeriod]
    implicit val decoder: Decoder[BillingPeriod] = deriveEnumerationDecoder[BillingPeriod]
  }

  case class GuardianWeeklyRatePlans(
    Annual: RatePlan,
    Monthly: RatePlan,
    Quarterly: RatePlan
  )

  case class GuardianWeeklyDomestic(
    customerFacingName: String,
    ratePlans: GuardianWeeklyRatePlans
  )

  case class GuardianWeeklyRestOfWorld(
    customerFacingName: String,
    ratePlans: GuardianWeeklyRatePlans
  )

  case class HomeDeliveryAndSubscriptionCardRatePlans(
    EverydayPlus: RatePlan,
    SaturdayPlus: RatePlan,
    WeekendPlus: RatePlan,
    SixdayPlus: RatePlan,
    // The only non-"Plus" rate plan is Sunday (Observer)
    Sunday: RatePlan
  )

  case class HomeDelivery(
    customerFacingName: String,
    ratePlans: HomeDeliveryAndSubscriptionCardRatePlans
  )

  case class SubscriptionCard(
    customerFacingName: String,
    ratePlans: HomeDeliveryAndSubscriptionCardRatePlans
  )

  case class NationalDeliveryRatePlans(
    EverydayPlus: RatePlan,
    SixdayPlus: RatePlan,
    WeekendPlus: RatePlan
  )

  case class NationalDelivery(
    customerFacingName: String,
    ratePlans: NationalDeliveryRatePlans
  )

  case class SupporterPlusRatePlans(
    Annual: RatePlan,
    Monthly: RatePlan,
  )
  case class SupporterPlus(
    customerFacingName: String,
    ratePlans: SupporterPlusRatePlans
  )

  case class TierThreeRatePlans(
    DomesticMonthly: RatePlan,
    DomesticAnnual: RatePlan,
    RestOfWorldMonthly: RatePlan,
    RestOfWorldAnnual: RatePlan
  )
  case class TierThree(
    customerFacingName: String,
    ratePlans: TierThreeRatePlans
  )

  import io.circe.generic.auto._

  implicit val encoder: Encoder[ProductCatalog] = deriveEncoder[ProductCatalog]
  implicit val decoder: Decoder[ProductCatalog] = deriveDecoder[ProductCatalog]
}
