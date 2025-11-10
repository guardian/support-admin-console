package models.promos

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._

case class PromoLandingPage(
  title: Option[String],
  description: Option[String],
  roundelHtml: Option[String]
)

object PromoLandingPage {
    implicit val decoder: Decoder[PromoLandingPage] = deriveDecoder[PromoLandingPage]
    implicit val encoder: Encoder[PromoLandingPage] = deriveEncoder[PromoLandingPage]
}
