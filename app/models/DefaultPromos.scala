package models

import io.circe.generic.auto._
import io.circe.{Decoder, Encoder}

case class DefaultPromos(
                          guardianWeekly: Seq[String],
                          paper: Seq[String]
                               )

object DefaultPromos {
  implicit val decoder = Decoder[DefaultPromos]
  implicit val encoder = Encoder[DefaultPromos]
}
