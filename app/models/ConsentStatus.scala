package models

import io.circe.derivation.{Configuration, ConfiguredEnumCodec}

sealed trait ConsentStatus derives ConfiguredEnumCodec

object ConsentStatus {
  case object All extends ConsentStatus
  case object HasConsented extends ConsentStatus
  case object HasNotConsented extends ConsentStatus
  given Configuration = Configuration.default
}
