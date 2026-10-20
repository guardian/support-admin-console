package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class DefaultChoiceCardsSettings(
    epic: Map[String, ChoiceCardsSettings] = Map.empty,
    banner: Map[String, ChoiceCardsSettings] = Map.empty,
    lastEditedBy: String = ""
) derives ConfiguredCodec

object DefaultChoiceCardsSettings {
  private val emptyChoiceCardsSettings = ChoiceCardsSettings(choiceCards = Nil)

  val stub: DefaultChoiceCardsSettings = DefaultChoiceCardsSettings(
    epic = Map("Default" -> emptyChoiceCardsSettings),
    banner = Map("Default" -> emptyChoiceCardsSettings),
    lastEditedBy = ""
  )

  given Configuration = Configuration.default.withDefaults
}
