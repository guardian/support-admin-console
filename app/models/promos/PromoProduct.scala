package models.promos

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveConfiguredDecoder, deriveConfiguredEncoder}

sealed trait PromoProduct
case object SupporterPlus extends PromoProduct
case object TierThree extends PromoProduct
case object DigitalPack extends PromoProduct
case object Newspaper extends PromoProduct
case object Weekly extends PromoProduct

object PromoProduct {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[PromoProduct] = deriveConfiguredDecoder[PromoProduct]
  implicit val encoder: Encoder[PromoProduct] = deriveConfiguredEncoder[PromoProduct]
}
