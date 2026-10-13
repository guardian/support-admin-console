package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class MaxViews(
    maxViewsCount: Int,
    maxViewsDays: Int,
    minDaysBetweenViews: Int
) derives ConfiguredCodec

object MaxViews {
  given Configuration = Configuration.default.withDefaults
}

case class ArticlesViewedSettings(
    minViews: Int,
    maxViews: Option[Int],
    periodInWeeks: Int,
    tagIds: List[String] = Nil
) derives ConfiguredCodec

object ArticlesViewedSettings {
  given Configuration = Configuration.default.withDefaults
}
