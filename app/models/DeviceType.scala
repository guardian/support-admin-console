package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{ deriveEnumerationDecoder, deriveEnumerationEncoder }
import io.circe.{Decoder, Encoder}

sealed trait DeviceType
case object All extends DeviceType
case object Desktop extends DeviceType
case object Mobile extends DeviceType
case object iOS extends DeviceType
case object Android extends DeviceType

object DeviceType {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[DeviceType] = deriveEnumerationDecoder[DeviceType]
  implicit val encoder: Encoder[DeviceType] = deriveEnumerationEncoder[DeviceType]
}
