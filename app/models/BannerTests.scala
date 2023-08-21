package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, DecodingFailure, Encoder, HCursor, Json}

sealed trait BannerUI
object BannerUI {
  case object AusEoyMomentBanner extends BannerUI
  case object AusAnniversaryBanner extends BannerUI
  case object AuBrandMomentBanner extends BannerUI
  case object ChoiceCardsBannerBlue extends BannerUI
  case object ChoiceCardsBannerYellow extends BannerUI
  case object ChoiceCardsButtonsBannerBlue extends BannerUI
  case object ChoiceCardsButtonsBannerYellow extends BannerUI
  case object ClimateCrisisMomentBanner extends BannerUI
  case object ContributionsBanner extends BannerUI
  case object ContributionsBannerWithSignIn extends BannerUI
  case object CharityAppealBanner extends BannerUI
  case object DigitalSubscriptionsBanner extends BannerUI
  case object ElectionAuMomentBanner extends BannerUI
  case object EnvironmentMomentBanner extends BannerUI
  case object GlobalNewYearBanner extends BannerUI
  case object GuardianWeeklyBanner extends BannerUI
  case object InvestigationsMomentBanner extends BannerUI
  case object PostElectionAuMomentAlbaneseBanner extends BannerUI
  case object PostElectionAuMomentHungBanner extends BannerUI
  case object PostElectionAuMomentMorrisonBanner extends BannerUI
  case object UkraineMomentBanner extends BannerUI
  case object WorldPressFreedomDayBanner extends BannerUI
  case object Scotus2023MomentBanner extends BannerUI
  case class BannerDesignName(name: String) extends BannerUI

  implicit val customConfig: Configuration = Configuration.default.withDefaults

  implicit val bannerDesignNameDecoder: Decoder[BannerDesignName] =
    deriveDecoder[BannerDesignName]

  implicit val customDecoder: Decoder[BannerUI] = (c: HCursor) =>
    c.as[String].flatMap {
      case "AusEoyMomentBanner"      => Right(AusEoyMomentBanner)
      case "AusAnniversaryBanner"    => Right(AusAnniversaryBanner)
      case "AuBrandMomentBanner"     => Right(AuBrandMomentBanner)
      case "ChoiceCardsBannerBlue"   => Right(ChoiceCardsBannerBlue)
      case "ChoiceCardsBannerYellow" => Right(ChoiceCardsBannerYellow)
      case "ChoiceCardsButtonsBannerBlue" =>
        Right(ChoiceCardsButtonsBannerBlue)
      case "ChoiceCardsButtonsBannerYellow" =>
        Right(ChoiceCardsButtonsBannerYellow)
      case "ClimateCrisisMomentBanner" => Right(ClimateCrisisMomentBanner)
      case "ContributionsBanner"       => Right(ContributionsBanner)
      case "ContributionsBannerWithSignIn" =>
        Right(ContributionsBannerWithSignIn)
      case "CharityAppealBanner"        => Right(CharityAppealBanner)
      case "DigitalSubscriptionsBanner" => Right(DigitalSubscriptionsBanner)
      case "ElectionAuMomentBanner"     => Right(ElectionAuMomentBanner)
      case "EnvironmentMomentBanner"    => Right(EnvironmentMomentBanner)
      case "GlobalNewYearBanner"        => Right(GlobalNewYearBanner)
      case "GuardianWeeklyBanner"       => Right(GuardianWeeklyBanner)
      case "InvestigationsMomentBanner" => Right(InvestigationsMomentBanner)
      case "PostElectionAuMomentAlbaneseBanner" =>
        Right(PostElectionAuMomentAlbaneseBanner)
      case "PostElectionAuMomentHungBanner" =>
        Right(PostElectionAuMomentHungBanner)
      case "PostElectionAuMomentMorrisonBanner" =>
        Right(PostElectionAuMomentMorrisonBanner)
      case "UkraineMomentBanner"        => Right(UkraineMomentBanner)
      case "WorldPressFreedomDayBanner" => Right(WorldPressFreedomDayBanner)
      case "Scotus2023MomentBanner"     => Right(Scotus2023MomentBanner)
      case stringValue =>
        Left(
          DecodingFailure(s"Unknown template value: $stringValue", c.history))
    } orElse c.as[BannerDesignName]
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
