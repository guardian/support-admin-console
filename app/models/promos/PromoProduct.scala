package models.promos
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.{Decoder, Encoder}

sealed trait PromoProduct
case object SupporterPlus extends PromoProduct
case object TierThree extends PromoProduct
case object DigitalPack extends PromoProduct
case object Newspaper extends PromoProduct
case object Weekly extends PromoProduct

object PromoProduct {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[PromoProduct] = deriveEnumerationDecoder[PromoProduct]
  implicit val encoder: Encoder[PromoProduct] = deriveEnumerationEncoder[PromoProduct]
}
