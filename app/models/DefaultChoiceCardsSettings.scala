package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveConfiguredDecoder, deriveConfiguredEncoder}

case class DefaultChoiceCardsSettings(
    epic: Map[String, ChoiceCardsSettings] = Map.empty,
    banner: Map[String, ChoiceCardsSettings] = Map.empty,
    lastEditedBy: String = ""
)

object DefaultChoiceCardsSettings {
  private val emptyChoiceCardsSettings = ChoiceCardsSettings(choiceCards = Nil)

  val stub: DefaultChoiceCardsSettings = DefaultChoiceCardsSettings(
    epic = Map("Default" -> emptyChoiceCardsSettings),
    banner = Map("Default" -> emptyChoiceCardsSettings),
    lastEditedBy = ""
  )

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[DefaultChoiceCardsSettings] =
    deriveConfiguredDecoder[DefaultChoiceCardsSettings]
  implicit val encoder: Encoder[DefaultChoiceCardsSettings] =
    deriveConfiguredEncoder[DefaultChoiceCardsSettings]
}
