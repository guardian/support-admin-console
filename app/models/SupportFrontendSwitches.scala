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

case class PaymentMethodSwitches(
  stripe: SwitchState,
  stripeApplePay: SwitchState,
  stripePaymentRequestButton: SwitchState,
  payPal: SwitchState,
  amazonPay: Option[SwitchState],
  directDebit: Option[SwitchState],
  existingCard: Option[SwitchState],
  existingDirectDebit: Option[SwitchState]
)

case class SupportFrontendSwitches(
  oneOffPaymentMethods: PaymentMethodSwitches,
  recurringPaymentMethods: PaymentMethodSwitches,
  experiments: Map[String, ExperimentSwitch],
  useDotcomContactPage: SwitchState,
  enableRecaptchaBackend: SwitchState,
  enableRecaptchaFrontend: SwitchState
)
