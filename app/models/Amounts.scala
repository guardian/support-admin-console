package models

import io.circe.generic.extras.Configuration
import io.circe.{Decoder, Encoder}
import models.{Region => RegionEnum}

case class AmountValuesObject(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Boolean
)

case class AmountsCardData(
    ONE_OFF: AmountValuesObject,
    MONTHLY: AmountValuesObject,
    ANNUAL: AmountValuesObject
)

case class AmountsVariant(
    variantName: String,
    defaultContributionType: String,
    displayContributionType: List[String],
    amountsCardData: AmountsCardData
)

sealed trait AmountsTestTargeting

object AmountsTestTargeting {
  case class Region(targetingType: String = "Region", region: RegionEnum) extends AmountsTestTargeting
  case class Country(targetingType: String = "Country", countries: List[String]) extends AmountsTestTargeting

  import io.circe.generic.extras.semiauto._
  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("targetingType")

  implicit val amountsTestTargetingDecoder: Decoder[AmountsTestTargeting] =
    deriveConfiguredDecoder[AmountsTestTargeting]
  implicit val amountsTestTargetingEncoder: Encoder[AmountsTestTargeting] =
    deriveConfiguredEncoder[AmountsTestTargeting]
}

case class AmountsTest(
    testName: String,
    liveTestName: Option[String],
    testLabel: Option[String],
    isLive: Boolean,
    targeting: AmountsTestTargeting,
    order: Int,
    seed: Int,
    variants: List[AmountsVariant]
)

object AmountsTests {
  import io.circe.generic.extras.auto._
  type AmountsTests = List[AmountsTest]

  implicit val customConfig: Configuration = Configuration.default.withDefaults

  implicit val decoder: Decoder[AmountsTests] = Decoder.decodeList[AmountsTest]
  implicit val encoder: Encoder[AmountsTests] = Encoder.encodeList[AmountsTest]
}
