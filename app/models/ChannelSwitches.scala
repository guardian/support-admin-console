package models

import io.circe.{ Decoder, Encoder }
import io.circe.generic.auto._

case class ChannelSwitches(
  enableEpics: Boolean,
  enableBanners: Boolean,
)

object ChannelSwitches {
  implicit val decoder = Decoder[ChannelSwitches]
  implicit val encoder = Encoder[ChannelSwitches]
}
