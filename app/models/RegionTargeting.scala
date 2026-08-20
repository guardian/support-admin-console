package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.{Decoder, Encoder}

sealed trait ContributionsOnlyCountriesTargeting

object ContributionsOnlyCountriesTargeting {
  case object Include extends ContributionsOnlyCountriesTargeting
  case object Exclude extends ContributionsOnlyCountriesTargeting
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ContributionsOnlyCountriesTargeting] =
    deriveEnumerationDecoder[ContributionsOnlyCountriesTargeting]
  implicit val encoder: Encoder[ContributionsOnlyCountriesTargeting] =
    deriveEnumerationEncoder[ContributionsOnlyCountriesTargeting]
}

case class RegionTargeting(
    targetedCountryGroups: List[Region] = Nil,
    targetedCountryCodes: Option[List[String]] = None,
    contributionsOnlyCountriesTargeting: Option[ContributionsOnlyCountriesTargeting] = None
)
