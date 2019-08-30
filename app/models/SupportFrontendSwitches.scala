package models

import io.circe.{Decoder, Encoder}
import utils.Circe.decodeStringAndCollect

/**
  * Based on https://github.com/guardian/support-frontend/blob/master/app/admin/Settings.scala
  */

sealed trait SwitchState
case object On extends SwitchState
case object Off extends SwitchState

case object SwitchState {
  implicit val switchStateEncoder: Encoder[SwitchState] = Encoder.encodeString.contramap[SwitchState] {
    case On => "On"
    case Off => "Off"
  }

  implicit val switchStateDecoder: Decoder[SwitchState] = decodeStringAndCollect {
    case "On" => On
    case "Off" => Off
  }
}

case class ExperimentSwitch(name: String, description: String, state: SwitchState)

case class PaymentMethodsSwitch(
  stripe: SwitchState,
  payPal: SwitchState,
  directDebit: Option[SwitchState],
  existingCard: Option[SwitchState],
  existingDirectDebit: Option[SwitchState]
)

case class SupportFrontendSwitches(
  oneOffPaymentMethods: PaymentMethodsSwitch,
  recurringPaymentMethods: PaymentMethodsSwitch,
  experiments: Map[String, ExperimentSwitch],
  optimize: SwitchState,
  usStripeAccount: SwitchState
)
