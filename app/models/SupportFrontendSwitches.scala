package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.{Decoder, Encoder}

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
  implicit val SupportFrontendSwitchesDecoder = Decoder[SupportFrontendSwitches]
  implicit val SupportFrontendSwitchesEncoder = Encoder[SupportFrontendSwitches]
}
