module Main exposing (..)

import Browser
import Html exposing (..)
import Html.Attributes as Attr
import Url
import Browser.Navigation as Nav
import Http
import Json.Decode exposing (decodeString)

import SupportConfig exposing (..)


---- MODEL ----


type Model =
    Route Url.Url |
    SupportConfig SupportConfigWithVersion

---- UPDATE ----


type Msg = GotSupportConfig (Result Http.Error String)
    | LinkClicked Browser.UrlRequest
    | UrlChanged Url.Url


getSupportConfig : Cmd Msg
getSupportConfig = Http.get {
        url = "/support-frontend/switches/data",
        expect = Http.expectString GotSupportConfig
    }

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotSupportConfig result ->
            case result of
                Ok resultText ->
                    case (decodeString supportConfigWithVersion resultText) of
                        Ok(config) -> ( SupportConfig config, Cmd.none )
                        Err e ->
                            let _ = Debug.log("Error decoding") e
                            in
                            ( model, Cmd.none)


                Err _ -> ( model, Cmd.none)

        LinkClicked url ->
            case url of
                Browser.Internal internalUrl -> (model, Nav.load internalUrl.path)
                Browser.External externalUrl -> (model, Nav.load externalUrl)

        -- This is never sent because we always let the browser leave the page upon `LinkClicked`
        UrlChanged url -> ( model, Cmd.none )


---- VIEW ----

index : Browser.Document Msg
index = { title = "Support Admin Console"
    , body =
        [ div [ Attr.class "elm-app"]
            [
                h1 [] [ text "Support Admin Console" ]
            ]
          , a [ Attr.href "/support-frontend/switches" ] [ text "switches" ]
        ]
    }

supportPage : Maybe SupportConfigWithVersion -> Browser.Document Msg
supportPage maybeSupportConfig =
    { title = "Switches"
    , body =
        [ div [ Attr.class "elm-app"]
            [
                h1 [] [ text "Support Frontend switches" ],
                case maybeSupportConfig of
                    Just supportConfig ->
                        div [] [
                            text (Debug.toString supportConfig),
                            form [] [
                                input [
                                    Attr.type_ "text",
                                    Attr.name "version",
                                    Attr.value supportConfig.version,
                                    Attr.disabled
                                ]
                                []
                            ]
                        ]

                    Nothing -> div [] [ text "Loading..."]
            ]
        ]
    }


view : Model -> Browser.Document Msg
view model =
    case model of
        Route url ->
            case url.path of
                "/support-frontend/switches" -> supportPage Nothing
                _ -> index

        SupportConfig config -> supportPage (Just config)


---- PROGRAM ----


main : Program () Model Msg
main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = always Sub.none
        , onUrlChange = UrlChanged
        , onUrlRequest = LinkClicked
        }

init : () -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init flags url key = (
        Route url,
        case url.path of
            "/support-frontend/switches" -> getSupportConfig
            _ -> Cmd.none
    )
