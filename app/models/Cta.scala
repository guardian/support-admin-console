package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class Cta(text: String, baseUrl: String) derives ConfiguredCodec

object Cta {
  given Configuration = Configuration.default.withDefaults
}

sealed trait SecondaryCta derives ConfiguredCodec

case class CustomSecondaryCta(
    `type`: String = "CustomSecondaryCta",
    cta: Cta
) extends SecondaryCta

case class ContributionsReminderSecondaryCta(
    `type`: String = "ContributionsReminderSecondaryCta"
) extends SecondaryCta

object SecondaryCta {
  given Configuration = Configuration.default.withDiscriminator("type")
}
