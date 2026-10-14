package models

import io.circe.Codec

case class Image(
    mainUrl: String,
    altText: String
) derives Codec.AsObject

case class BylineWithImage(
    name: String,
    description: Option[String],
    headshot: Option[Image]
) derives Codec.AsObject
