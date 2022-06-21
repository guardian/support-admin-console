package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

case class Campaign(
  name: String,
  nickname: Option[String],
  description: Option[String]
)

object Campaigns {
  type Campaigns = List[Campaign]

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder = Decoder[Campaigns]
  implicit val encoder = Encoder[Campaigns]
}
