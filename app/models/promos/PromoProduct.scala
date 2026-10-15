package models.promos
import io.circe.derivation.{Configuration, ConfiguredEnumCodec}

sealed trait PromoProduct derives ConfiguredEnumCodec
case object SupporterPlus extends PromoProduct
case object TierThree extends PromoProduct
case object DigitalSubscription extends PromoProduct
case object Newspaper extends PromoProduct
case object Weekly extends PromoProduct

object PromoProduct {
  given Configuration = Configuration.default
}
