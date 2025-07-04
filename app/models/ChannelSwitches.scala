package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.auto._
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
    enableGutterLiveblogs: Boolean = true
)

object ChannelSwitches {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder = Decoder[ChannelSwitches]
  implicit val encoder = Encoder[ChannelSwitches]
}
