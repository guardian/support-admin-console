package models

case class Image(
  mainUrl: String,
  altText: String
)

case class BylineWithImage(
    name: String,
    description: Option[String],
    headshot: Option[Image],
)