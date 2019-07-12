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

  case object OnlyExistingSupporters extends UserCohort
  case object OnlyNonSupporters extends UserCohort
  case object Everyone extends UserCohort

}

case class EpicVariant(
  name: String,
  heading: String,
  paragraphs: List[String],
  highlightedText: Option[String] = None,
  footer: Option[String] = None,
  showTicker: Boolean = false,
  backgroundImageUrl: Option[String] = None,
  ctaText: Option[String] = None,
  supportBaseURL: Option[String] = None
)

case class EpicTest(
  name: String,
  locations: List[Region] = Nil,
  tagIds: List[String] = Nil,
  sections: List[String] = Nil,
  excludedTagIds: List[String] = Nil,
  excludedSections: List[String] = Nil,
  alwaysAsk: Boolean = false,
  userCohort: Option[UserCohort] = None,
  hasCountryName: Boolean = false,
  variants: List[EpicVariant]
)

object EpicTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestDecoder = Decoder[EpicTest]
  implicit val epicTestEncoder = Encoder[EpicTest]
}
