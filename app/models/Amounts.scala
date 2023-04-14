package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}

case class AmountValuesObject(
    amounts: List[Int], 
    defaultAmount: Int,
    hideChooseYourAmount: Option[Boolean],
)

case class AmountsCardData(
    ONE_OFF: AmountValuesObject,
    MONTHLY: AmountValuesObject,
    ANNUAL: AmountValuesObject,
)

case class AmountsVariant(
  variantName: String,
  // defaultContributionType: ContributionsType,
  amountsCardData: AmountsCardData,
)

case class AmountsTest(
  testName: String,
  isLive: Boolean,
  target: String,
  seed: Int,
  variants: List[AmountsVariant],
)

object AmountsTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val configuredAmountsDecoder: Decoder[AmountsTest] = deriveConfiguredDecoder[AmountsTest]
  implicit val configuredAmountsEncoder: Encoder[AmountsTest] = deriveConfiguredEncoder[AmountsTest]
}

object AmountsTests {
  type AmountsTests = List[AmountsTest]

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder = Decoder[AmountsTests]
  implicit val encoder = Encoder[AmountsTests]
}

