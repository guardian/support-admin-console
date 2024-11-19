package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

sealed trait Methodology

case class ABTest(name: String = "ABTest") extends Methodology
case class EpsilonGreedyBandit(name: String = "EpsilonGreedyBandit", epsilon: Double) extends Methodology

case object Methodology {
  val defaultMethodologies = List(ABTest())

  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("name")

  implicit val secondaryCtaDecoder = Decoder[Methodology]
  implicit val secondaryCtaEncoder = Encoder[Methodology]
}
