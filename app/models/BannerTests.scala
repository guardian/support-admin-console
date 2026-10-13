package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import models.Methodology.defaultMethodologies

case class BannerUI(designName: String) derives ConfiguredCodec

object BannerUI {
  given Configuration = Configuration.default.withDefaults
}

sealed trait BannerStepMode derives ConfiguredEnumCodec

object BannerStepMode {
  case object OneStep extends BannerStepMode
  case object TwoStep extends BannerStepMode
  case object TwoStepIfAllowed extends BannerStepMode

  given Configuration = Configuration.default
}

case class BannerContent(
    heading: Option[String],
    paragraphs: Option[List[String]],
    messageText: Option[String],
    highlightedText: Option[String],
    cta: Option[Cta],
    secondaryCta: Option[SecondaryCta]
) derives ConfiguredCodec

object BannerContent {
  given Configuration = Configuration.default.withDefaults
}

case class BannerVariant(
    name: String,
    template: BannerUI,
    bannerContent: Option[BannerContent],
    mobileBannerContent: Option[BannerContent],
    separateArticleCount: Option[Boolean],
    separateArticleCountSettings: Option[SeparateArticleCount],
    tickerSettings: Option[TickerSettings] = None,
    choiceCardsSettings: Option[ChoiceCardsSettings],
    promoCodes: List[String] = Nil,
    isCollapsible: Option[Boolean] = None,
    bannerStepMode: Option[BannerStepMode] = None
) derives ConfiguredCodec

object BannerVariant {
  given Configuration = Configuration.default.withDefaults
}

case class BannerTestDeploySchedule(daysBetween: Int) derives ConfiguredCodec

object BannerTestDeploySchedule {
  given Configuration = Configuration.default.withDefaults
}
case class BannerTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    userCohort: UserCohort,
    locations: List[Region] = Nil,
    regionTargeting: Option[RegionTargeting] = None,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil, Nil, Nil, Nil),
    variants: List[BannerVariant],
    articlesViewedSettings: Option[ArticlesViewedSettings] = None,
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    deploySchedule: Option[BannerTestDeploySchedule] = None,
    methodologies: List[Methodology] = defaultMethodologies,
    frontsOnly: Option[Boolean] = None,
    mParticleAudience: Option[Int] = None,
    scheduler: Option[Scheduler] = None,
    mParticleTemplates: Option[List[String]]
) extends ChannelTest[BannerTest] derives ConfiguredCodec {

  override def withChannel(channel: Channel): BannerTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): BannerTest =
    this.copy(priority = Some(priority))
}

object BannerTest {
  given Configuration = Configuration.default.withDefaults
}
