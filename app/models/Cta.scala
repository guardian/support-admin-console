package models
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

case class Cta(text: String, baseUrl: String)

sealed trait SecondaryCta

case class CustomSecondaryCta(
  `type`: String = "CustomSecondaryCta",
  cta: Cta,
) extends SecondaryCta

case class ContributionsReminderSecondaryCta(
  `type`: String = "ContributionsReminderSecondaryCta",
) extends SecondaryCta

object SecondaryCta {
  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("type")

  implicit val secondaryCtaDecoder = Decoder[SecondaryCta]
  implicit val secondaryCtaEncoder = Encoder[SecondaryCta]
}
