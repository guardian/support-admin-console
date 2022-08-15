package models

import io.circe.generic.auto._
import io.circe.{Decoder, Encoder}

case class AppsMeteringSwitches(
  enabled: Boolean,
  excludeBreakingNews: Boolean,
  requireApiKey: Boolean
)

object AppsMeteringSwitches {
  implicit val decoder = Decoder[AppsMeteringSwitches]
  implicit val encoder = Encoder[AppsMeteringSwitches]
}
