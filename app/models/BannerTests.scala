package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder, Json}

case class BannerUI(designName: String)

case class BannerContent(
    heading: Option[String],
    paragraphs: Option[List[String]],
    messageText: Option[String],
    highlightedText: Option[String],
    cta: Option[Cta],
    secondaryCta: Option[SecondaryCta]
)

case class BannerVariant(
    name: String,
    template: BannerUI,
    bannerContent: Option[BannerContent],
    mobileBannerContent: Option[BannerContent],
    separateArticleCount: Option[Boolean],
    separateArticleCountSettings: Option[SeparateArticleCount],
    tickerSettings: Option[TickerSettings] = None,
)

case class BannerTestDeploySchedule(daysBetween: Int)

case class BannerTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    userCohort: UserCohort,
    locations: List[Region] = Nil,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil,Nil,Nil,Nil),
    variants: List[BannerVariant],
    articlesViewedSettings: Option[ArticlesViewedSettings] = None,
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    isBanditTest: Option[Boolean] = None,
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    deploySchedule: Option[BannerTestDeploySchedule] = None,
) extends ChannelTest[BannerTest] {

  override def withChannel(channel: Channel): BannerTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): BannerTest =
    this.copy(priority = Some(priority))
}

object BannerTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTestDecoder: Decoder[BannerTest] =
    deriveConfiguredDecoder[BannerTest]
  implicit val bannerTestEncoder: Encoder[BannerTest] =
    deriveConfiguredEncoder[BannerTest]
}
