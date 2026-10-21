package models

import io.circe.Codec
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
    enableInline1Tests: Boolean = false,
    enableMParticle: Boolean = false,
    enableAuxia: Boolean = false,
    enableAuxiaForBanners: Boolean = false,
    auxiaBannerRolloutPercentage: Int = 100,
    enableGandalfSignInGate: Boolean = false
)

object ChannelSwitches {
  given Configuration = Configuration.default.withDefaults

  private val derivedCodec = ConfiguredCodec.derived[ChannelSwitches]
  given Codec.AsObject[ChannelSwitches] = Codec.AsObject.from(
    derivedCodec.emap { switches =>
      Either.cond(
        switches.auxiaBannerRolloutPercentage >= 0 && switches.auxiaBannerRolloutPercentage <= 100,
        switches,
        "auxiaBannerRolloutPercentage must be between 0 and 100"
      )
    },
    derivedCodec
  )
}
