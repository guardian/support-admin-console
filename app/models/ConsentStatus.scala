package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.{Decoder, Encoder}

sealed trait ConsentStatus

object ConsentStatus {
  case object All extends ConsentStatus
  case object HasConsented extends ConsentStatus
  case object HasNotConsented extends ConsentStatus
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ConsentStatus] = deriveEnumerationDecoder[ConsentStatus]
  implicit val encoder: Encoder[ConsentStatus] = deriveEnumerationEncoder[ConsentStatus]
}
