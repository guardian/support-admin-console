package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq

sealed trait TickerEndType extends EnumEntry
object TickerEndType extends Enum[TickerEndType] with CirceEnum[TickerEndType] {
  override val values: IndexedSeq[TickerEndType] = findValues

  case object unlimited extends TickerEndType
  case object hardstop extends TickerEndType
}

sealed trait TickerCountType extends EnumEntry
object TickerCountType extends Enum[TickerCountType] with CirceEnum[TickerCountType] {
  override val values: IndexedSeq[TickerCountType] = findValues

  case object money extends TickerCountType
  case object people extends TickerCountType
}

case class TickerCopy(
  countLabel: String,
  goalReachedPrimary: String,
  goalReachedSecondary: String
)

case class TickerSettings(
  endType: TickerEndType,
  countType: TickerCountType,
  currencySymbol: String,
  copy: TickerCopy
)

sealed trait SeparateArticleCountType extends EnumEntry
object SeparateArticleCountType extends Enum[SeparateArticleCountType] with CirceEnum[SeparateArticleCountType] {
  override val values: IndexedSeq[SeparateArticleCountType] = findValues

  case object above extends SeparateArticleCountType
}

case class SeparateArticleCount(
  `type`: SeparateArticleCountType,
)

case class EpicVariant(
  name: String,
  heading: Option[String],
  paragraphs: List[String],
  highlightedText: Option[String] = None,
  footer: Option[String] = None,
  showTicker: Boolean = false,  // Deprecated - use tickerSettings instead
  tickerSettings: Option[TickerSettings] = None,
  backgroundImageUrl: Option[String] = None,
  cta: Option[Cta],
  secondaryCta: Option[SecondaryCta],
  separateArticleCount: Option[SeparateArticleCount],
)
case class EpicTest(
  name: String,
  nickname: Option[String],
  isOn: Boolean,
  locations: List[Region] = Nil,
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
  controlProportionSettings: Option[ControlProportionSettings] = None
)

case class EpicTests(tests: List[EpicTest])

object EpicTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestDecoder = Decoder[EpicTest]
  implicit val epicTestEncoder = Encoder[EpicTest]
  implicit val epicTestsDecoder = Decoder[EpicTests]
  implicit val epicTestsEncoder = Encoder[EpicTests]
}
