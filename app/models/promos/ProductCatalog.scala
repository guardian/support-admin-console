package models.promos

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveConfiguredDecoder, deriveConfiguredEncoder}
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}
import io.circe.{Decoder, Encoder}
import ProductCatalog._

// format: off
/**
 * Example JSON from the product catalog, excluding fields that we do not care about here:
 *
 * {
 *  "SupporterPlus": {
 *     "customerFacingName": "All-access digital",
 *     "ratePlans": {
 *       "Monthly": {
 *         "id": "8ad08cbd8586721c01858804e3275376",
 *         "pricing": {
 *           "USD": 15,
 *           "NZD": 20,
 *           "EUR": 12,
 *           "GBP": 12,
 *           "CAD": 15,
 *           "AUD": 20
 *         },
 *         "billingPeriod": "Month"
 *       },
 *       "Annual": {
 *         "id": "8ad08e1a8586721801858805663f6fab",
 *         "pricing": {
 *           "USD": 150,
 *           "NZD": 200,
 *           "EUR": 120,
 *           "GBP": 120,
 *           "CAD": 150,
 *           "AUD": 200
 *         },
 *         "billingPeriod": "Annual"
 *       }
 *     }
 *   },
 *   ...
 * }
 */
// format: on

case class ProductCatalog(
    GuardianWeeklyDomestic: ProductDetails[GuardianWeeklyRatePlans],
    GuardianWeeklyRestOfWorld: ProductDetails[GuardianWeeklyRatePlans],
    HomeDelivery: ProductDetails[HomeDeliveryAndSubscriptionCardRatePlans],
    SubscriptionCard: ProductDetails[HomeDeliveryAndSubscriptionCardRatePlans],
    NationalDelivery: ProductDetails[NationalDeliveryRatePlans],
    SupporterPlus: ProductDetails[SupporterPlusRatePlans],
    TierThree: ProductDetails[TierThreeRatePlans],
    DigitalSubscription: ProductDetails[DigitalSubscriptionRatePlans]
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

  object Pricing {
    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val encoder: Encoder[Pricing] = deriveConfiguredEncoder[Pricing]
    implicit val decoder: Decoder[Pricing] = deriveConfiguredDecoder[Pricing]
  }

  case class RatePlan(
      billingPeriod: BillingPeriod,
      id: String,
      pricing: Pricing,
      termLengthInMonths: Option[Int] = None
  )

  object RatePlan {
    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val encoder: Encoder[RatePlan] = deriveConfiguredEncoder[RatePlan]
    implicit val decoder: Decoder[RatePlan] = deriveConfiguredDecoder[RatePlan]
  }

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
      Annual: Option[RatePlan],
      AnnualPlus: Option[RatePlan],
      Monthly: Option[RatePlan],
      MonthlyPlus: Option[RatePlan],
      Quarterly: Option[RatePlan],
      QuarterlyPlus: Option[RatePlan],
      OneYearGift: Option[RatePlan],
      ThreeMonthGift: Option[RatePlan]
  ) extends ProductRatePlans

  object GuardianWeeklyRatePlans {
    implicit val encoder: Encoder[GuardianWeeklyRatePlans] =
      deriveEncoder[GuardianWeeklyRatePlans]
    implicit val decoder: Decoder[GuardianWeeklyRatePlans] =
      deriveDecoder[GuardianWeeklyRatePlans]
  }

  case class HomeDeliveryAndSubscriptionCardRatePlans(
      EverydayPlus: RatePlan,
      SaturdayPlus: RatePlan,
      WeekendPlus: RatePlan,
      SixdayPlus: RatePlan,
      // The only non-"Plus" rate plan is Sunday (Observer)
      Sunday: RatePlan
  ) extends ProductRatePlans

  object HomeDeliveryAndSubscriptionCardRatePlans {
    implicit val encoder: Encoder[HomeDeliveryAndSubscriptionCardRatePlans] =
      deriveEncoder[HomeDeliveryAndSubscriptionCardRatePlans]
    implicit val decoder: Decoder[HomeDeliveryAndSubscriptionCardRatePlans] =
      deriveDecoder[HomeDeliveryAndSubscriptionCardRatePlans]
  }

  case class NationalDeliveryRatePlans(
      EverydayPlus: RatePlan,
      SixdayPlus: RatePlan,
      WeekendPlus: RatePlan
  ) extends ProductRatePlans

  object NationalDeliveryRatePlans {
    implicit val encoder: Encoder[NationalDeliveryRatePlans] =
      deriveEncoder[NationalDeliveryRatePlans]
    implicit val decoder: Decoder[NationalDeliveryRatePlans] =
      deriveDecoder[NationalDeliveryRatePlans]
  }

  case class SupporterPlusRatePlans(
      Annual: RatePlan,
      AnnualTaxExclusive: RatePlan,
      Monthly: RatePlan,
      MonthlyTaxExclusive: RatePlan
  ) extends ProductRatePlans

  object SupporterPlusRatePlans {
    implicit val encoder: Encoder[SupporterPlusRatePlans] =
      deriveEncoder[SupporterPlusRatePlans]
    implicit val decoder: Decoder[SupporterPlusRatePlans] =
      deriveDecoder[SupporterPlusRatePlans]
  }

  case class TierThreeRatePlans(
      DomesticMonthly: RatePlan,
      DomesticAnnual: RatePlan,
      RestOfWorldMonthly: RatePlan,
      RestOfWorldAnnual: RatePlan
  ) extends ProductRatePlans

  object TierThreeRatePlans {
    implicit val encoder: Encoder[TierThreeRatePlans] = deriveEncoder[TierThreeRatePlans]
    implicit val decoder: Decoder[TierThreeRatePlans] = deriveDecoder[TierThreeRatePlans]
  }

  case class DigitalSubscriptionRatePlans(
      Monthly: RatePlan,
      MonthlyTaxExclusive: RatePlan,
      Annual: RatePlan,
      AnnualTaxExclusive: RatePlan,
      Quarterly: RatePlan
  ) extends ProductRatePlans

  object DigitalSubscriptionRatePlans {
    implicit val encoder: Encoder[DigitalSubscriptionRatePlans] =
      deriveEncoder[DigitalSubscriptionRatePlans]
    implicit val decoder: Decoder[DigitalSubscriptionRatePlans] =
      deriveDecoder[DigitalSubscriptionRatePlans]
  }

  trait ProductDetails[R <: ProductRatePlans] {
    def customerFacingName: String
    def ratePlans: R
  }

  object ProductDetails {
    implicit def productDetailsEncoder[R <: ProductRatePlans: Encoder]: Encoder[ProductDetails[R]] =
      Encoder.forProduct2("customerFacingName", "ratePlans")(pd => (pd.customerFacingName, pd.ratePlans))

    implicit def productDetailsDecoder[R <: ProductRatePlans: Decoder]: Decoder[ProductDetails[R]] =
      Decoder.forProduct2[ProductDetails[R], String, R]("customerFacingName", "ratePlans")((name, rps) =>
        new ProductDetails[R] {
          val customerFacingName: String = name
          val ratePlans: R = rps
        }
      )
  }

  import io.circe.generic.auto._

  implicit val encoder: Encoder[ProductCatalog] = io.circe.generic.semiauto.deriveEncoder[ProductCatalog]
  implicit val decoder: Decoder[ProductCatalog] = io.circe.generic.semiauto.deriveDecoder[ProductCatalog]
}
