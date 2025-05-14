package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.auto._
import ChoiceCardsSettings._
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

case class ChoiceCardsSettings(choiceCards: List[ChoiceCard])

object ChoiceCardsSettings {
  case class ProductBenefit(copy: String)

  sealed trait RatePlan
  object RatePlan {
    object Monthly extends RatePlan
    object Annual extends RatePlan

    implicit val customConfig: Configuration = Configuration.default.withDefaults
    implicit val ratePlanEncoder = deriveEnumerationEncoder[RatePlan]
    implicit val ratePlanDecoder = deriveEnumerationDecoder[RatePlan]
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

    import io.circe.generic.extras.auto._
    implicit val customConfig: Configuration = Configuration.default.withDiscriminator("supportTier")
    implicit val productDecoder = Decoder[Product]
    implicit val productEncoder = Encoder[Product]
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

  implicit val choiceCardsSettingsDecoder = Decoder[ChoiceCardsSettings]
  implicit val choiceCardsSettingsEncoder = Encoder[ChoiceCardsSettings]
}
