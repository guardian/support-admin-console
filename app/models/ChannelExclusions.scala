package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.Configuration

case class DateRange(
    start: String, // ISO date "YYYY-MM-DD", inclusive
    end: String    // ISO date "YYYY-MM-DD", inclusive
)

object DateRange {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[DateRange] = deriveConfiguredDecoder[DateRange]
  implicit val encoder: Encoder[DateRange] = deriveConfiguredEncoder[DateRange]
}

case class ExclusionRule(
  name: String = "",
    sectionIds: Option[List[String]] = None,   // suppress if the page's sectionId matches any entry
    tagIds: Option[List[String]] = None,        // suppress if the page has any of these tag IDs
    dateRange: Option[DateRange] = None,        // ISO date "YYYY-MM-DD", inclusive
    contentTypes: Option[List[String]] = None   // e.g. ["Article"], ["Front"]; absent = all content types
)

object ExclusionRule {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ExclusionRule] = deriveConfiguredDecoder[ExclusionRule]
  implicit val encoder: Encoder[ExclusionRule] = deriveConfiguredEncoder[ExclusionRule]
}

case class ChannelExclusions(
    rules: List[ExclusionRule]
)

object ChannelExclusions {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ChannelExclusions] = deriveConfiguredDecoder[ChannelExclusions]
  implicit val encoder: Encoder[ChannelExclusions] = deriveConfiguredEncoder[ChannelExclusions]
}

case class ChannelExclusionSettings(
    epic: Option[ChannelExclusions] = None,
    banner: Option[ChannelExclusions] = None,
    gutterAsk: Option[ChannelExclusions] = None,
    header: Option[ChannelExclusions] = None
)

object ChannelExclusionSettings {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ChannelExclusionSettings] = deriveConfiguredDecoder[ChannelExclusionSettings]
  implicit val encoder: Encoder[ChannelExclusionSettings] = deriveConfiguredEncoder[ChannelExclusionSettings]
}
