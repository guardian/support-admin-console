package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}
import enumeratum.{CirceEnum, Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

sealed trait SwitchState extends EnumEntry
object SwitchState extends Enum[SwitchState] with CirceEnum[SwitchState] {
  override val values: IndexedSeq[SwitchState] = findValues

  case object On extends SwitchState
  case object Off extends SwitchState
}

object SupportFrontendSwitches {

  case class Switch(description: String, state: SwitchState)
  type SwitchName = String
  type SwitchGroup = Map[SwitchName,Switch]
  type GroupName = String
  type SupportFrontendSwitches = Map[GroupName,SwitchGroup]

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val SupportFrontendSwitchesDecoder = Decoder[SupportFrontendSwitches]
  implicit val SupportFrontendSwitchesEncoder = Encoder[SupportFrontendSwitches]
}
