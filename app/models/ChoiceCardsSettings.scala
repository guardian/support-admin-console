package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import ChoiceCardsSettings.*
import io.circe.Codec

case class ChoiceCardsSettings(choiceCards: List[ChoiceCard]) derives Codec.AsObject

object ChoiceCardsSettings {
  case class ProductBenefit(copy: String) derives Codec.AsObject

  sealed trait RatePlan derives ConfiguredEnumCodec
  object RatePlan {
    case object Monthly extends RatePlan
    case object Annual extends RatePlan

    given Configuration = Configuration.default
  }

  sealed trait Product derives ConfiguredCodec {
    val supportTier: String
  }
  object Product {
    case class Contribution(
        supportTier: String = "Contribution",
        ratePlan: RatePlan
    ) extends Product

    case class SupporterPlus(
        supportTier: String = "SupporterPlus",
        ratePlan: RatePlan
    ) extends Product
    case class DigitalSubscription(
        supportTier: String = "DigitalSubscription",
        ratePlan: RatePlan
    ) extends Product

    case class OneOff(
        supportTier: String = "OneOff"
    ) extends Product

    given Configuration = Configuration.default.withDiscriminator("supportTier")
  }

  sealed trait Destination derives ConfiguredEnumCodec
  object Destination {
    case object LandingPage extends Destination
    case object Checkout extends Destination

    given Configuration = Configuration.default
  }

  case class DestinationTest(testName: String, variantName: String) derives Codec.AsObject

  case class Pill(copy: String) derives Codec.AsObject

  case class ChoiceCard(
      product: Product,
      label: String,
      benefitsLabel: Option[String],
      benefits: List[ProductBenefit],
      pill: Option[Pill],
      isDefault: Boolean,
      destination: Option[Destination],
      destinationTest: Option[DestinationTest]
  ) derives ConfiguredCodec

  object ChoiceCard {
    given Configuration = Configuration.default.withDefaults
  }

  given Configuration = Configuration.default.withDefaults
}
