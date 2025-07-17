package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.auto._
import ChoiceCardsSettings._
import io.circe.generic.extras.semiauto.{
  deriveConfiguredDecoder,
  deriveConfiguredEncoder,
  deriveEnumerationDecoder,
  deriveEnumerationEncoder
}

case class ChoiceCardsSettings(choiceCards: List[ChoiceCard])

object ChoiceCardsSettings {
  case class ProductBenefit(copy: String)

  sealed trait RatePlan
  object RatePlan {
    object Monthly extends RatePlan
    object Annual extends RatePlan

    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val ratePlanEncoder: Encoder[RatePlan] = deriveEnumerationEncoder[RatePlan]
    implicit val ratePlanDecoder: Decoder[RatePlan] = deriveEnumerationDecoder[RatePlan]
  }

  sealed trait Product {
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

    case class OneOff(
        supportTier: String = "OneOff"
    ) extends Product

    implicit val customConfig: Configuration = Configuration.default.withDiscriminator("supportTier")
    implicit val productDecoder: Decoder[Product] = deriveConfiguredDecoder[Product]
    implicit val productEncoder: Encoder[Product] = deriveConfiguredEncoder[Product]
  }

  case class Pill(copy: String)

  case class ChoiceCard(
      product: Product,
      label: String,
      benefitsLabel: Option[String],
      benefits: List[ProductBenefit],
      pill: Option[Pill],
      isDefault: Boolean
  )

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val choiceCardsSettingsDecoder: Decoder[ChoiceCardsSettings] = deriveConfiguredDecoder[ChoiceCardsSettings]
  implicit val choiceCardsSettingsEncoder: Encoder[ChoiceCardsSettings] = deriveConfiguredEncoder[ChoiceCardsSettings]
}
