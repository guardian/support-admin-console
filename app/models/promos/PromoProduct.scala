package models.promos

sealed trait PromoProduct
case object SupporterPlus extends PromoProduct
case object TierThree extends PromoProduct
case object DigitalPack extends PromoProduct
case object Newspaper extends PromoProduct
case object Weekly extends PromoProduct
