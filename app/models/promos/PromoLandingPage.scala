package models.promos

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._
import io.circe.syntax._
import io.circe.DecodingFailure

sealed trait DefaultProduct
object DefaultProduct {
  case object Voucher extends DefaultProduct
  case object Delivery extends DefaultProduct
  case object NationalDelivery extends DefaultProduct

  implicit val encoder: Encoder[DefaultProduct] = Encoder.encodeString.contramap {
    case Voucher => "voucher"
    case Delivery => "delivery"
    case NationalDelivery => "nationalDelivery"
  }

  implicit val decoder: Decoder[DefaultProduct] = Decoder.decodeString.emap {
    case "voucher" => Right(Voucher)
    case "delivery" => Right(Delivery)
    case "nationalDelivery" => Right(NationalDelivery)
    case other => Left(s"Unknown DefaultProduct: $other")
  }
}

case class PromoLandingPage(
  title: Option[String],
  description: Option[String],
  roundelHtml: Option[String],
  defaultProduct: Option[DefaultProduct]
)

object PromoLandingPage {
    implicit val decoder: Decoder[PromoLandingPage] = deriveDecoder[PromoLandingPage]
    implicit val encoder: Encoder[PromoLandingPage] = deriveEncoder[PromoLandingPage]
}
