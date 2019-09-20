package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration

import scala.collection.immutable.IndexedSeq
import io.circe.generic.extras.auto._

sealed trait Region extends EnumEntry

object Region extends Enum[Region] with CirceEnum[Region] {
  override val values: IndexedSeq[Region] = findValues

  case object GBPCountries extends Region
  case object UnitedStates extends Region
  case object EURCountries extends Region
  case object AUDCountries extends Region
  case object International extends Region
  case object NZDCountries extends Region
  case object Canada extends Region
}

sealed trait UserCohort extends EnumEntry

object UserCohort extends Enum[UserCohort] with CirceEnum[UserCohort] {
  override val values: IndexedSeq[UserCohort] = findValues

  case object AllExistingSupporters extends UserCohort
  case object AllNonSupporters extends UserCohort
  case object Everyone extends UserCohort
  case object PostAskPauseSingleContributors extends UserCohort
}

case class Cta(text: Option[String], baseUrl: Option[String])

case class EpicVariant(
  name: String,
  heading: Option[String],
  paragraphs: List[String],
  highlightedText: Option[String] = None,
  footer: Option[String] = None,
  showTicker: Boolean = false,
  backgroundImageUrl: Option[String] = None,
  cta: Option[Cta]
)

case class EpicTest(
  name: String,
  isOn: Boolean,
  locations: List[Region] = Nil,
  tagIds: List[String] = Nil,
  sections: List[String] = Nil,
  excludedTagIds: List[String] = Nil,
  excludedSections: List[String] = Nil,
  alwaysAsk: Boolean = false,
  userCohort: Option[UserCohort] = None,
  isLiveBlog: Boolean = false,
  hasCountryName: Boolean = false,
  variants: List[EpicVariant],
  highPriority: Boolean = false,
  maxViewsCount: Int,
  useLocalViewLog: Boolean = false,
  audience: Float = 1.0,
  audienceOffset: Float = 0.0
)

case class EpicTests(tests: List[EpicTest])

object EpicTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestsDecoder = Decoder[EpicTests]
  implicit val epicTestsEncoder = Encoder[EpicTests]
}
