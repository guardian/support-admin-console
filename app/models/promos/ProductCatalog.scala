package models.promos

import io.circe.generic.extras.Configuration
import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import ProductCatalog._

case class ProductCatalog(
  GuardianWeeklyDomestic: ProductDetails[GuardianWeeklyRatePlans],
  GuardianWeeklyRestOfWorld: ProductDetails[GuardianWeeklyRatePlans],
  HomeDelivery: ProductDetails[HomeDeliveryAndSubscriptionCardRatePlans],
  SubscriptionCard: ProductDetails[HomeDeliveryAndSubscriptionCardRatePlans],
  NationalDelivery: ProductDetails[NationalDeliveryRatePlans],
  SupporterPlus: ProductDetails[SupporterPlusRatePlans],
  TierThree: ProductDetails[TierThreeRatePlans]
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

  sealed trait ProductRatePlans

  case class GuardianWeeklyRatePlans(
    Annual: RatePlan,
    Monthly: RatePlan,
    Quarterly: RatePlan
  ) extends ProductRatePlans

  case class HomeDeliveryAndSubscriptionCardRatePlans(
    EverydayPlus: RatePlan,
    SaturdayPlus: RatePlan,
    WeekendPlus: RatePlan,
    SixdayPlus: RatePlan,
    // The only non-"Plus" rate plan is Sunday (Observer)
    Sunday: RatePlan
  ) extends ProductRatePlans

  case class NationalDeliveryRatePlans(
    EverydayPlus: RatePlan,
    SixdayPlus: RatePlan,
    WeekendPlus: RatePlan
  ) extends ProductRatePlans

  case class SupporterPlusRatePlans(
    Annual: RatePlan,
    Monthly: RatePlan,
  ) extends ProductRatePlans

  case class TierThreeRatePlans(
    DomesticMonthly: RatePlan,
    DomesticAnnual: RatePlan,
    RestOfWorldMonthly: RatePlan,
    RestOfWorldAnnual: RatePlan
  ) extends ProductRatePlans

  trait ProductDetails[R <: ProductRatePlans] {
    def customerFacingName: String
    def ratePlans: R
  }

  object ProductDetails {
    implicit def productDetailsEncoder[R <: ProductRatePlans : Encoder]: Encoder[ProductDetails[R]] =
      Encoder.forProduct2("customerFacingName", "ratePlans")(pd => (pd.customerFacingName, pd.ratePlans))

    implicit def productDetailsDecoder[R <: ProductRatePlans : Decoder]: Decoder[ProductDetails[R]] =
      Decoder.forProduct2[ProductDetails[R], String, R]("customerFacingName", "ratePlans")((name, rps) =>
        new ProductDetails[R] {
          val customerFacingName: String = name
          val ratePlans: R = rps
        }
      )
  }

  import io.circe.generic.auto._

  implicit val encoder: Encoder[ProductCatalog] = deriveEncoder[ProductCatalog]
  implicit val decoder: Decoder[ProductCatalog] = deriveDecoder[ProductCatalog]
}
