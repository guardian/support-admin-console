package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class PageContextTargeting(
    tagIds: List[String] = Nil,
    sectionIds: List[String] = Nil,
    excludedTagIds: List[String] = Nil,
    excludedSectionIds: List[String] = Nil
) derives ConfiguredCodec

object PageContextTargeting {
  given Configuration = Configuration.default.withDefaults
}
