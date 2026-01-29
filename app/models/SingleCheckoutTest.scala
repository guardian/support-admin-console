package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}
import models.Methodology.defaultMethodologies
import models.Channel.SingleCheckout

case class AmountsData(
    ONE_OFF: AmountValuesObject,
    MONTHLY: AmountValuesObject,
    ANNUAL: AmountValuesObject
)

case class Amounts(
    defaultContributionType: String,
    displayContributionType: List[String],
    amountsCardData: AmountsData
)

case class SingleCheckoutVariant(
    name: String,
    heading: String,
    subheading: String,
    amounts: Amounts
)

case class SingleCheckoutTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    variants: List[SingleCheckoutVariant],
    methodologies: List[Methodology] = defaultMethodologies,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN")
) extends ChannelTest[SingleCheckoutTest] {

  override def withChannel(channel: Channel): SingleCheckoutTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): SingleCheckoutTest =
    this.copy(priority = Some(priority))
}

object SingleCheckoutTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val SingleCheckoutTestDecoder: Decoder[SingleCheckoutTest] =
    deriveConfiguredDecoder[SingleCheckoutTest]
  implicit val SingleCheckoutTestEncoder: Encoder[SingleCheckoutTest] =
    deriveConfiguredEncoder[SingleCheckoutTest]
}
