package models

import io.circe.derivation.{Configuration, ConfiguredCodec}
import io.circe.{Decoder, Encoder}

case class Campaign(
    name: String,
    nickname: String,
    description: Option[String],
    notes: Option[List[String]],
    isActive: Option[Boolean]
) derives ConfiguredCodec

object Campaigns {
  type Campaigns = List[Campaign]
  implicit val decoder: Decoder[Campaigns] = Decoder.decodeList[Campaign]
  implicit val encoder: Encoder[Campaigns] = Encoder.encodeList[Campaign]
}

object Campaign {
  given Configuration = Configuration.default.withDefaults
}
