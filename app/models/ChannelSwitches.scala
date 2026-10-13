package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

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
    enableMParticle: Boolean = false,
    enableAuxia: Boolean = false,
    enableAuxiaForBanners: Boolean = false,
    enableGandalfSignInGate: Boolean = false
) derives ConfiguredCodec

object ChannelSwitches {
  given Configuration = Configuration.default.withDefaults
}
