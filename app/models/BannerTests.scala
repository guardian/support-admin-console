package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}



sealed trait BannerTemplate
object BannerTemplate {
  case object ContributionsBanner extends BannerTemplate
  case object ContributionsBannerWithSignIn extends BannerTemplate
  case object CharityAppealBanner extends BannerTemplate
  case object DigitalSubscriptionsBanner extends BannerTemplate
  case object GuardianWeeklyBanner extends BannerTemplate
  case object InvestigationsMomentBanner extends BannerTemplate
  case object EnvironmentMomentBanner extends BannerTemplate
  case object GlobalNewYearBanner extends BannerTemplate
  case object ElectionAuMomentBanner extends BannerTemplate
  case object PostElectionAuMomentAlbaneseBanner extends BannerTemplate
  case object PostElectionAuMomentHungBanner extends BannerTemplate
  case object PostElectionAuMomentMorrisonBanner extends BannerTemplate
  case object AuBrandMomentBanner extends BannerTemplate
  case object ClimateCrisisMomentBanner extends BannerTemplate
  case object UsEoyMomentBanner extends BannerTemplate
  case object UsEoyGivingTuesMomentBanner extends BannerTemplate
  case object AusEoyMomentBanner extends BannerTemplate
  case object UsEoyMomentBannerV3 extends BannerTemplate

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTemplateEncoder = deriveEnumerationEncoder[BannerTemplate]
  implicit val bannerTemplateDecoder = deriveEnumerationDecoder[BannerTemplate]
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
  template: BannerTemplate,
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

  override def withChannel(channel: Channel): BannerTest = this.copy(channel = Some(channel))
  override def withPriority(priority: Int): BannerTest = this.copy(priority = Some(priority))
}

object BannerTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTestDecoder: Decoder[BannerTest] = deriveConfiguredDecoder[BannerTest]
  implicit val bannerTestEncoder: Encoder[BannerTest] = deriveConfiguredEncoder[BannerTest]
}
