package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}

sealed trait ContributionsOnlyCountriesTargeting derives ConfiguredEnumCodec

object ContributionsOnlyCountriesTargeting {
  case object Include extends ContributionsOnlyCountriesTargeting
  case object Exclude extends ContributionsOnlyCountriesTargeting
  given Configuration = Configuration.default
}

case class RegionTargeting(
    targetedCountryGroups: List[Region] = Nil,
    targetedCountryCodes: Option[List[String]] = None,
    contributionsOnlyCountriesTargeting: Option[ContributionsOnlyCountriesTargeting] = None
) derives ConfiguredCodec

object RegionTargeting {
  given Configuration = Configuration.default.withDefaults
}
