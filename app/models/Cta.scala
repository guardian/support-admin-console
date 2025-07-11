package models
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}

case class Cta(text: String, baseUrl: String)

object Cta {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val secondaryCtaDecoder: Decoder[Cta] = deriveConfiguredDecoder[Cta]
  implicit val secondaryCtaEncoder: Encoder[Cta] = deriveConfiguredEncoder[Cta]
}

sealed trait SecondaryCta

case class CustomSecondaryCta(
    `type`: String = "CustomSecondaryCta",
    cta: Cta
) extends SecondaryCta

case class ContributionsReminderSecondaryCta(
    `type`: String = "ContributionsReminderSecondaryCta"
) extends SecondaryCta

object SecondaryCta {
  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("type")

  implicit val secondaryCtaDecoder: Decoder[SecondaryCta] = deriveConfiguredDecoder[SecondaryCta]
  implicit val secondaryCtaEncoder: Encoder[SecondaryCta] = deriveConfiguredEncoder[SecondaryCta]
}
