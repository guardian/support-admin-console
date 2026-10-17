package models

import io.circe.derivation.{Configuration, ConfiguredEnumCodec}

sealed trait DeviceType derives ConfiguredEnumCodec
case object All extends DeviceType
case object Desktop extends DeviceType
case object Mobile extends DeviceType
case object iOS extends DeviceType
case object Android extends DeviceType

object DeviceType {
  given Configuration = Configuration.default
}
