package models

import io.circe.{ Decoder, Encoder }
import io.circe.generic.auto._

case class AmountValuesObject(
  amounts: List[Int],
  defaultAmount: Int,
  hideChooseYourAmount: Option[Boolean],
)

sealed trait ContributionType

object ContributionType {
  override val values: IndexedSeq[ContributionType] = findValues

  case object ONE_OFF extends ContributionType
  case object MONTHLY extends ContributionType
  case object ANNUAL extends ContributionType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val contributionTypeEncoder = deriveEnumerationEncoder[ContributionType]
  implicit val contributionTypeDecoder = deriveEnumerationDecoder[ContributionType]
}

case class AmountValuesPacket(
  ONE_OFF: AmountValuesObject,
  MONTHLY: AmountValuesObject,
  ANNUAL: AmountValuesObject,
)

case class AmountsVariant(
  variantName: String,
  defaultContributionsType: ContributionsType,
  amountsCardData: AmountValuesPacket,
)

case class AmountsTest(
  testName: String,
  isLive: Boolean,
  target: String,
  seed: Number;
  variants: List[AmountsVariant];
)

object ConfiguredAmounts {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val configuredAmountsDecoder: Decoder[AmountsTest] = deriveConfiguredDecoder[AmountsTest]
  implicit val configuredAmountsEncoder: Encoder[AmountsTest] = deriveConfiguredEncoder[AmountsTest]
}
