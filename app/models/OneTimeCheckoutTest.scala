package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}
import models.Methodology.defaultMethodologies
import models.Channel.OneTimeCheckout

case class OneTimeCheckoutVariant(
    name: String,
    heading: String,
    subheading: String,
    amounts: AmountValuesObject,
    tickerSettings: Option[TickerSettings] = None
)

case class OneTimeCheckoutTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    variants: List[OneTimeCheckoutVariant],
    methodologies: List[Methodology] = defaultMethodologies,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    mParticleAudience: Option[Int] = None
) extends ChannelTest[OneTimeCheckoutTest] {

  override def withChannel(channel: Channel): OneTimeCheckoutTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): OneTimeCheckoutTest =
    this.copy(priority = Some(priority))
}

object OneTimeCheckoutTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val OneTimeCheckoutTestDecoder: Decoder[OneTimeCheckoutTest] =
    deriveConfiguredDecoder[OneTimeCheckoutTest]
  implicit val OneTimeCheckoutTestEncoder: Encoder[OneTimeCheckoutTest] =
    deriveConfiguredEncoder[OneTimeCheckoutTest]
}
