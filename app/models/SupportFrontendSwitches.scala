package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait SwitchState derives ConfiguredEnumCodec
case object On extends SwitchState
case object Off extends SwitchState

object SwitchState {
  given Configuration = Configuration.default
}

object SupportFrontendSwitches {

  case class Switch(description: String, state: SwitchState) derives ConfiguredCodec
  type SwitchName = String
  case class SwitchGroup(description: String, switches: Map[SwitchName, Switch]) derives ConfiguredCodec
  type GroupName = String
  type SupportFrontendSwitches = Map[GroupName, SwitchGroup]

  given Configuration = Configuration.default.withDefaults

  implicit val SupportFrontendSwitchesDecoder: Decoder[SupportFrontendSwitches] =
    Decoder.decodeMap[GroupName, SwitchGroup](using KeyDecoder.decodeKeyString, summon[Decoder[SwitchGroup]])
  implicit val SupportFrontendSwitchesEncoder: Encoder[SupportFrontendSwitches] =
    Encoder.encodeMap[GroupName, SwitchGroup](using KeyEncoder.encodeKeyString, summon[Encoder[SwitchGroup]])
}
