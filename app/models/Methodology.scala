package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

sealed trait Methodology {
  val testName: Option[String]
}

case class ABTest(
  name: String = "ABTest",
  testName: Option[String] = None
) extends Methodology

case class EpsilonGreedyBandit(
  name: String = "EpsilonGreedyBandit",
  epsilon: Double,
  testName: Option[String] = None
) extends Methodology

case object Methodology {
  val defaultMethodologies = List(ABTest())

  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("name")

  implicit val secondaryCtaDecoder = Decoder[Methodology]
  implicit val secondaryCtaEncoder = Encoder[Methodology]
}
