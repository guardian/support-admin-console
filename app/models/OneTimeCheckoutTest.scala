package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import models.Methodology.defaultMethodologies
import models.Channel.OneTimeCheckout

sealed trait MParticleAmountAttribute derives ConfiguredEnumCodec

object MParticleAmountAttribute {
  case object last_single_contribution_amount extends MParticleAmountAttribute

  given Configuration = Configuration.default
}

case class AmountValuesObject(
    amounts: List[Int],
    defaultAmount: Int,
    hideChooseYourAmount: Boolean,
    mParticleAmountAttribute: Option[MParticleAmountAttribute] = None
) derives ConfiguredCodec

object AmountValuesObject {
  given Configuration = Configuration.default.withDefaults
}

case class OneTimeCheckoutVariant(
    name: String,
    heading: String,
    subheading: String,
    amounts: AmountValuesObject,
    tickerSettings: Option[TickerSettings] = None
) derives ConfiguredCodec

object OneTimeCheckoutVariant {
  given Configuration = Configuration.default.withDefaults
}

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
    mParticleAudience: Option[Int] = None,
    mParticleTemplates: Option[List[String]] = None
) extends ChannelTest[OneTimeCheckoutTest] derives ConfiguredCodec {
  override val scheduler: Option[Scheduler] = None

  override def withChannel(channel: Channel): OneTimeCheckoutTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): OneTimeCheckoutTest =
    this.copy(priority = Some(priority))
}

object OneTimeCheckoutTest {
  given Configuration = Configuration.default.withDefaults
}
