package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder, Json}

sealed trait BannerUI
object BannerUI {
  // For backwards compatibility BannerUI is either the name of a template, or has a nested designName field
  case class BannerDesignName(designName: String) extends BannerUI
  sealed trait BannerTemplate extends BannerUI

  case object AusEoyMomentBanner extends BannerTemplate
  case object AusAnniversaryMomentBanner extends BannerTemplate
  case object AuBrandMomentBanner extends BannerTemplate
  case object ClimateCrisisMomentBanner extends BannerTemplate
  case object ContributionsBanner extends BannerTemplate
  case object ContributionsBannerWithSignIn extends BannerTemplate
  case object ElectionAuMomentBanner extends BannerTemplate
  case object EnvironmentBanner extends BannerTemplate
  case object GlobalNewYearMomentBanner extends BannerTemplate
  case object GuardianWeeklyBanner extends BannerTemplate
  case object InvestigationsMomentBanner extends BannerTemplate
  case object PostElectionAuMomentAlbaneseBanner extends BannerTemplate
  case object PostElectionAuMomentHungBanner extends BannerTemplate
  case object PostElectionAuMomentMorrisonBanner extends BannerTemplate
  case object UkraineMomentBanner extends BannerTemplate
  case object WorldPressFreedomDayBanner extends BannerTemplate
  case object Scotus2023MomentBanner extends BannerTemplate
  case object EuropeMomentLocalLanguageBanner extends BannerTemplate
  case object SupporterMomentBanner extends BannerTemplate
  case object EnvironmentMomentBanner extends BannerTemplate
  case object ChoiceCardsMomentBanner extends BannerTemplate

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  import cats.syntax.functor._  // for the widen syntax

  implicit val bannerUIDecoder: Decoder[BannerUI] = Decoder[BannerDesignName].widen or deriveEnumerationDecoder[BannerTemplate].widen

  implicit val bannerUIEncoder: Encoder[BannerUI] = Encoder.instance {
    case BannerDesignName(designName) =>
      Json.obj("designName" -> Json.fromString(designName))
    case template: BannerTemplate => Json.fromString(s"$template")
  }
}

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
    tickerSettings: Option[TickerSettings] = None,
)

case class BannerTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    minArticlesBeforeShowingBanner: Int,
    userCohort: UserCohort,
    locations: List[Region] = Nil,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil,Nil,Nil,Nil),
    variants: List[BannerVariant],
    articlesViewedSettings: Option[ArticlesViewedSettings] = None,
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
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
