package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

case class Campaign(
  name: String,
  nickname: String,
  description: Option[String],
  notes: Option[List[String]]
)

object Campaigns {
  type Campaigns = List[Campaign]

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder = Decoder[Campaigns]
  implicit val encoder = Encoder[Campaigns]
}

object Campaign {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder = Decoder[Campaign]
  implicit val encoder = Encoder[Campaign]
}
