module SupportConfig exposing (..)

import Json.Decode as Decode
import Json.Decode exposing (Decoder, field)
import Json.Decode.Pipeline

----- Support config models -----

type Switch = On | Off
switchToString : Switch -> String
switchToString switch =
    case switch of
        On -> "On"
        Off -> "Off"

type alias PaymentMethodSwitches = {
       stripe: Switch,
       payPal: Switch,
       directDebit: Maybe Switch
    }

type alias SupportSwitches = {
        oneOffPaymentMethods: PaymentMethodSwitches,
        recurringPaymentMethods: PaymentMethodSwitches
    }

type alias SupportConfig = {
        switches: SupportSwitches
    }

type alias SupportConfigWithVersion = {
        version: String,
        value: SupportConfig
    }


----- Decoders -----

switchDecoder : Decoder Switch
switchDecoder =
    Decode.string
        |> Decode.andThen (\str ->
            case str of
                "On" ->
                    Decode.succeed On
                "Off" ->
                    Decode.succeed Off
                other ->
                    Decode.fail <| "Invalid Switch state: " ++ other
        )

paymentMethodSwitches: Decoder PaymentMethodSwitches
paymentMethodSwitches = Decode.map3 PaymentMethodSwitches
    (field "stripe" switchDecoder)
    (field "payPal" switchDecoder)
    (Decode.maybe (field "directDebit" switchDecoder))

supportSwitchesDecoder : Decoder SupportSwitches
supportSwitchesDecoder = Decode.map2 SupportSwitches
    (field "oneOffPaymentMethods" paymentMethodSwitches)
    (field "recurringPaymentMethods" paymentMethodSwitches)

supportConfigDecoder : Decoder SupportConfig
supportConfigDecoder = Decode.map (\switches -> { switches = switches })
    (Decode.at ["switches"] supportSwitchesDecoder)

supportConfigWithVersion: Decoder SupportConfigWithVersion
supportConfigWithVersion = Decode.map2 SupportConfigWithVersion
    (field "version" Decode.string)
    (field "value" supportConfigDecoder)
