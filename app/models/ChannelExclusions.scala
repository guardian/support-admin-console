package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class DateRange(
    start: String, // ISO date "YYYY-MM-DD", inclusive
    end: String // ISO date "YYYY-MM-DD", inclusive
) derives ConfiguredCodec

object DateRange {
  given Configuration = Configuration.default.withDefaults
}

case class ExclusionRule(
    name: String = "",
    sectionIds: Option[List[String]] = None, // suppress if the page's sectionId matches any entry
    tagIds: Option[List[String]] = None, // suppress if the page has any of these tag IDs
    frontIds: Option[List[String]] =
      None, // suppress if the page is one of these network fronts (uk, us, au, europe, international)
    dateRange: Option[DateRange] = None, // ISO date "YYYY-MM-DD", inclusive
    contentTypes: Option[List[String]] = None // e.g. ["Article"], ["Front"]; absent = all content types
) derives ConfiguredCodec

object ExclusionRule {
  given Configuration = Configuration.default.withDefaults
}

case class ChannelExclusions(
    rules: List[ExclusionRule]
) derives ConfiguredCodec

object ChannelExclusions {
  given Configuration = Configuration.default.withDefaults
}

case class ChannelExclusionSettings(
    epic: Option[ChannelExclusions] = None,
    banner: Option[ChannelExclusions] = None,
    gutterAsk: Option[ChannelExclusions] = None,
    header: Option[ChannelExclusions] = None
) derives ConfiguredCodec

object ChannelExclusionSettings {
  given Configuration = Configuration.default.withDefaults
}
