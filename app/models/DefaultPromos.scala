package models

import io.circe.generic.semiauto._
import io.circe.{Decoder, Encoder}

case class DefaultPromos(
    guardianWeekly: Seq[String],
    paper: Seq[String],
    digital: Seq[String],
    supporterPlus: Seq[String],
    tierThree: Seq[String]
)

object DefaultPromos {
  implicit val decoder: Decoder[DefaultPromos] = deriveDecoder[DefaultPromos]
  implicit val encoder: Encoder[DefaultPromos] = deriveEncoder[DefaultPromos]
}
