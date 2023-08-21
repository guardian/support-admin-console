package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder, Json}

case class AmountValuesObject(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Boolean,
)

case class AmountsCardData(
    ONE_OFF: AmountValuesObject,
    MONTHLY: AmountValuesObject,
    ANNUAL: AmountValuesObject,
)

case class AmountsVariant(
  variantName: String,
  defaultContributionType: String,
  displayContributionType: List[String],
  amountsCardData: AmountsCardData,
)

sealed trait AmountsTestTargeting
case class RegionTargeting(region: Region) extends AmountsTestTargeting
case class CountryTargeting(countryCodes: List[String]) extends AmountsTestTargeting

object AmountsTestTargeting {
  import io.circe.generic.auto._
  import cats.syntax.functor._  // for the widen syntax

  implicit val amountsTestTargetingDecoder: Decoder[AmountsTestTargeting] =
    Decoder[RegionTargeting].widen or Decoder[CountryTargeting].widen

  implicit val amountsTestTargetingEncoder: Encoder[AmountsTestTargeting] = Encoder.instance {
    case RegionTargeting(region) => Json.fromFields(List(
      "region" -> Json.fromString(region.toString)
    ))
    case CountryTargeting(countryCodes) => Json.fromFields(List(
      "countryCodes" -> Json.fromValues(countryCodes.map(Json.fromString))
    ))
  }
}

case class AmountsTest(
  testName: String,
  liveTestName: Option[String],
  testLabel: Option[String],
  isLive: Boolean,
  targeting: AmountsTestTargeting,
  order: Int,
  seed: Int,
  variants: List[AmountsVariant],
)

object AmountsTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults

  implicit val decoder = Decoder[AmountsTest]
  implicit val encoder = Encoder[AmountsTest]
}

object AmountsTests {
  type AmountsTests = List[AmountsTest]

  implicit val customConfig: Configuration = Configuration.default.withDefaults

  implicit val decoder = Decoder[AmountsTests]
  implicit val encoder = Encoder[AmountsTests]
}

