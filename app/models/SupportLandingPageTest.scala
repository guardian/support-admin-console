package models

import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

case class SupportLandingPageCopy(
    heading: String,
    subheading: String
) derives ConfiguredCodec

object SupportLandingPageCopy {
  given Configuration = Configuration.default.withDefaults
}

case class ProductBenefit(
    copy: String,
    tooltip: Option[String] = None,
    label: Option[Label] = None
) derives ConfiguredCodec

object ProductBenefit {
  given Configuration = Configuration.default.withDefaults
}

case class Label(
    copy: String
) derives ConfiguredCodec

object Label {
  given Configuration = Configuration.default.withDefaults
}

case class LandingPageProductDescription(
    title: String,
    titlePill: Option[String] = None,
    billingPeriodsCopy: Option[String] = None,
    label: Option[Label] = None,
    benefits: List[ProductBenefit],
    cta: LandingPageCta
) derives ConfiguredCodec

object LandingPageProductDescription {
  given Configuration = Configuration.default.withDefaults
}

case class LandingPageCta(
    copy: String
) derives ConfiguredCodec

object LandingPageCta {
  given Configuration = Configuration.default.withDefaults
}

case class Products(
    Contribution: LandingPageProductDescription,
    SupporterPlus: LandingPageProductDescription,
    DigitalSubscription: Option[LandingPageProductDescription] = None
) derives ConfiguredCodec

object Products {
  given Configuration = Configuration.default.withDefaults
}

case class DefaultProductSelection(
    productType: String,
    billingPeriod: String
) derives ConfiguredCodec

object DefaultProductSelection {
  given Configuration = Configuration.default.withDefaults
}

case class SupportLandingPageVariant(
    name: String,
    copy: SupportLandingPageCopy,
    products: Products,
    tickerSettings: Option[TickerSettings] = None,
    countdownSettings: Option[CountdownSettings] = None,
    defaultProductSelection: Option[DefaultProductSelection] = None
) derives ConfiguredCodec

object SupportLandingPageVariant {
  given Configuration = Configuration.default.withDefaults
}

case class SupportLandingPageTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    variants: List[SupportLandingPageVariant],
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    methodologies: List[Methodology] = defaultMethodologies,
    mParticleAudience: Option[Int] = None,
    scheduler: Option[Scheduler] = None
) extends ChannelTest[SupportLandingPageTest] derives ConfiguredCodec {

  override def withChannel(channel: Channel): SupportLandingPageTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): SupportLandingPageTest =
    this.copy(priority = Some(priority))
}

object SupportLandingPageTest {
  given Configuration = Configuration.default.withDefaults
}
