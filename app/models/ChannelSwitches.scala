package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.Configuration

case class ChannelSwitches(
    enableEpics: Boolean,
    enableAppleNewsEpics: Boolean = true,
    enableBanners: Boolean,
    enableHeaders: Boolean = true,
    enableSuperMode: Boolean,
    enableHardcodedEpicTests: Boolean,
    enableHardcodedBannerTests: Boolean,
    enableScheduledBannerDeploys: Boolean = true,
    enableGutterLiveblogs: Boolean = true,
    enableMParticle: Boolean = false
)

object ChannelSwitches {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ChannelSwitches] = deriveConfiguredDecoder[ChannelSwitches]
  implicit val encoder: Encoder[ChannelSwitches] = deriveConfiguredEncoder[ChannelSwitches]
}
