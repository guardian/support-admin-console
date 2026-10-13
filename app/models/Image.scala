package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class Image(
    mainUrl: String,
    altText: String
) derives ConfiguredCodec

object Image {
  given Configuration = Configuration.default.withDefaults
}

case class BylineWithImage(
    name: String,
    description: Option[String],
    headshot: Option[Image]
) derives ConfiguredCodec

object BylineWithImage {
  given Configuration = Configuration.default.withDefaults
}
