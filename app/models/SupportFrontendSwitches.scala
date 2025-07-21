package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder, KeyDecoder, KeyEncoder}

sealed trait SwitchState
case object On extends SwitchState
case object Off extends SwitchState

object SupportFrontendSwitches {

  case class Switch(description: String, state: SwitchState)
  type SwitchName = String
  case class SwitchGroup(description: String, switches: Map[SwitchName, Switch])
  type GroupName = String
  type SupportFrontendSwitches = Map[GroupName, SwitchGroup]

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val stateDecoder: Decoder[SwitchState] = deriveEnumerationDecoder[SwitchState]
  implicit val stateEncoder: Encoder[SwitchState] = deriveEnumerationEncoder[SwitchState]
  import io.circe.generic.extras.semiauto._

  implicit val switchDecoder: Decoder[Switch] = deriveConfiguredDecoder[Switch]
  implicit val switchEncoder: Encoder[Switch] = deriveConfiguredEncoder[Switch]
  implicit val switchGroupDecoder: Decoder[SwitchGroup] = deriveConfiguredDecoder[SwitchGroup]
  implicit val switchGroupEncoder: Encoder[SwitchGroup] = deriveConfiguredEncoder[SwitchGroup]
  implicit val SupportFrontendSwitchesDecoder: Decoder[SupportFrontendSwitches] =
    Decoder.decodeMap[GroupName, SwitchGroup](KeyDecoder.decodeKeyString, switchGroupDecoder)
  implicit val SupportFrontendSwitchesEncoder: Encoder[SupportFrontendSwitches] =
    Encoder.encodeMap[GroupName, SwitchGroup](KeyEncoder.encodeKeyString, switchGroupEncoder)
}
