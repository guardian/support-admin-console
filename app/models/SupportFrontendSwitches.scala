package models

import io.circe.{Decoder, Encoder}
import play.api.data._
import play.api.data.Forms._
import play.api.data.format.Formatter

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

  implicit val switchStateDecoder: Decoder[SwitchState] = Decoder.decodeString.map {
    case "On" => On
    case _ => Off
  }
}

case class ExperimentSwitch(name: String, description: String, state: SwitchState)

case class PaymentMethodsSwitch(stripe: SwitchState, payPal: SwitchState, directDebit: Option[SwitchState])

case class SupportFrontendSwitches(
  oneOffPaymentMethods: PaymentMethodsSwitch,
  recurringPaymentMethods: PaymentMethodsSwitch,
  experiments: Set[ExperimentSwitch],
  optimize: SwitchState
)

case class SupportFrontendSettings(switches: SupportFrontendSwitches)

object SupportFrontendSwitches {

  implicit def switchStateFormat: Formatter[SwitchState] = new Formatter[SwitchState] {
    def bind(key: String, data: Map[String, String]): Either[Seq[FormError], SwitchState] = {
      data.get(key).collect {
        case "On" => On
        case "Off" => Off
      }.toRight(Seq(FormError(key, "error.required", Nil)))
    }

    def unbind(key: String, value: SwitchState) = {
      val s = value match {
        case On => "On"
        case Off => "Off"
      }
      Map(key -> s)
    }
  }

  val paymentMethodsSwitchMapping = mapping(
    "stripe" -> of[SwitchState],
    "payPal" -> of[SwitchState],
    "directDebit" -> optional(of[SwitchState])
  )(PaymentMethodsSwitch.apply)(PaymentMethodsSwitch.unapply)

  val experimentSwitchMapping = mapping(
    "name" -> text,
    "description" -> text,
    "state" -> of[SwitchState]
  )(ExperimentSwitch.apply)(ExperimentSwitch.unapply)

  val supportFrontendSwitchesMapping = mapping(
    "oneOffPaymentMethods" -> paymentMethodsSwitchMapping,
    "recurringPaymentMethods" -> paymentMethodsSwitchMapping,
    "experiments" -> set(experimentSwitchMapping),
    "optimize" -> of[SwitchState]
  )(SupportFrontendSwitches.apply)(SupportFrontendSwitches.unapply)

  val supportFrontendSettingsMapping = mapping(
    "switches" -> supportFrontendSwitchesMapping
  )(SupportFrontendSettings.apply)(SupportFrontendSettings.unapply)
}