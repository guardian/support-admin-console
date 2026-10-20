package models

import io.circe.derivation.{Configuration, ConfiguredEnumCodec}

sealed trait SignedInStatus derives ConfiguredEnumCodec

object SignedInStatus {
  case object All extends SignedInStatus
  case object SignedIn extends SignedInStatus
  case object SignedOut extends SignedInStatus
  given Configuration = Configuration.default
}
