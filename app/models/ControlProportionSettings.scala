package models

import io.circe.Codec
import io.circe.derivation.ConfiguredCodec

case class ControlProportionSettings(proportion: Float, offset: Int) derives Codec.AsObject
