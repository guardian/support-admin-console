package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class ControlProportionSettings(proportion: Float, offset: Int) derives ConfiguredCodec

object ControlProportionSettings {
  given Configuration = Configuration.default.withDefaults
}
