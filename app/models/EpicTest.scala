package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}
import models.Methodology.defaultMethodologies

import scala.collection.immutable.IndexedSeq

sealed trait SeparateArticleCountType extends EnumEntry
object SeparateArticleCountType extends Enum[SeparateArticleCountType] with CirceEnum[SeparateArticleCountType] {
  override val values: IndexedSeq[SeparateArticleCountType] = findValues

  case object above extends SeparateArticleCountType
}

case class SeparateArticleCount(
  `type`: SeparateArticleCountType,
  copy: Option[String]
)

case class EpicVariant(
  name: String,
  heading: Option[String],
  paragraphs: List[String],
  highlightedText: Option[String] = None,
  showTicker: Boolean = false,  // Deprecated - use tickerSettings instead
  tickerSettings: Option[TickerSettings] = None,
  image: Option[Image] = None,
  cta: Option[Cta],
  secondaryCta: Option[SecondaryCta],
  separateArticleCount: Option[SeparateArticleCount],
  showChoiceCards: Option[Boolean],
  bylineWithImage: Option[BylineWithImage],
  defaultChoiceCardFrequency: Option[String],
  showSignInLink: Option[Boolean],
  newsletterSignup: Option[NewsletterSignup],
)
case class EpicTest(
  name: String,
  channel: Option[Channel],
  status: Option[Status],
  lockStatus: Option[LockStatus],
  priority: Option[Int],
  nickname: Option[String],
  locations: List[Region] = Nil,
  targetedCountries: List[String] = Nil,
  tagIds: List[String] = Nil,
  sections: List[String] = Nil,
  excludedTagIds: List[String] = Nil,
  excludedSections: List[String] = Nil,
  alwaysAsk: Boolean = false,
  maxViews: Option[MaxViews],
  userCohort: Option[UserCohort] = None,
  hasCountryName: Boolean = false,
  variants: List[EpicVariant],
  highPriority: Boolean = false, // has been removed from form, but might be used in future
  useLocalViewLog: Boolean = false,
  articlesViewedSettings: Option[ArticlesViewedSettings] = None,
  controlProportionSettings: Option[ControlProportionSettings] = None,
  deviceType: Option[DeviceType] = None,
  campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
  signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
  consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
  methodologies: List[Methodology] = defaultMethodologies
) extends ChannelTest[EpicTest] {

  override def withChannel(channel: Channel): EpicTest = this.copy(channel = Some(channel))
  override def withPriority(priority: Int): EpicTest = this.copy(priority = Some(priority))
}

object EpicTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestDecoder: Decoder[EpicTest] = deriveConfiguredDecoder[EpicTest]
  implicit val epicTestEncoder: Encoder[EpicTest] = deriveConfiguredEncoder[EpicTest]
}
