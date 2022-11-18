package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{ deriveEnumerationDecoder, deriveEnumerationEncoder }
import io.circe.{Decoder, Encoder}

sealed trait SignedInStatus

object SignedInStatus {
  case object All extends SignedInStatus
  case object SignedIn extends SignedInStatus
  case object SignedOut extends SignedInStatus
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[SignedInStatus] = deriveEnumerationDecoder[SignedInStatus]
  implicit val encoder: Encoder[SignedInStatus] = deriveEnumerationEncoder[SignedInStatus]
}
