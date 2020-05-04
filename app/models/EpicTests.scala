package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

case class Cta(text: Option[String], baseUrl: Option[String])

case class EpicVariant(
  name: String,
  heading: Option[String],
  paragraphs: List[String],
  highlightedText: Option[String] = None,
  footer: Option[String] = None,
  showTicker: Boolean = false,
  backgroundImageUrl: Option[String] = None,
  cta: Option[Cta],
  secondaryCta: Option[Cta]
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
  isLiveBlog: Boolean = false,
  hasCountryName: Boolean = false,
  variants: List[EpicVariant],
  highPriority: Boolean = false, // has been removed from form, but might be used in future
  useLocalViewLog: Boolean = false,
  articlesViewedSettings: Option[ArticlesViewedSettings] = None
)

case class EpicTests(tests: List[EpicTest])

object EpicTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestsDecoder = Decoder[EpicTests]
  implicit val epicTestsEncoder = Encoder[EpicTests]
}
