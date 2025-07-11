package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}

case class Campaign(
    name: String,
    nickname: String,
    description: Option[String],
    notes: Option[List[String]],
    isActive: Option[Boolean]
)

object Campaigns {
  type Campaigns = List[Campaign]
  import io.circe.generic.extras.auto._
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[Campaigns] = Decoder.decodeList[Campaign]
  implicit val encoder: Encoder[Campaigns] = Encoder.encodeList[Campaign]
}

object Campaign {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[Campaign] = deriveConfiguredDecoder[Campaign]
  implicit val encoder: Encoder[Campaign] = deriveConfiguredEncoder[Campaign]
}
