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
    enableMParticle: Boolean = false,
    enableAuxia: Boolean = false,
    enableAuxiaForBanners: Boolean = false,
    auxiaBannerRolloutPercentage: Int = 100,
    enableGandalfSignInGate: Boolean = false
)

object ChannelSwitches {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ChannelSwitches] =
    deriveConfiguredDecoder[ChannelSwitches].emap { switches =>
      if (switches.auxiaBannerRolloutPercentage >= 0 && switches.auxiaBannerRolloutPercentage <= 100) {
        Right(switches)
      } else {
        Left("auxiaBannerRolloutPercentage must be between 0 and 100")
      }
    }
  implicit val encoder: Encoder[ChannelSwitches] = deriveConfiguredEncoder[ChannelSwitches]
}
