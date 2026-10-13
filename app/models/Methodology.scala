package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

sealed trait Methodology derives ConfiguredCodec {
  val testName: Option[String]
}

case class ABTest(
    name: String = "ABTest",
    testName: Option[String] = None
) extends Methodology

case class EpsilonGreedyBandit(
    name: String = "EpsilonGreedyBandit",
    epsilon: Double,
    testName: Option[String] = None,
    sampleCount: Option[Int] = None
) extends Methodology

case class Roulette(
    name: String = "Roulette",
    testName: Option[String] = None,
    sampleCount: Option[Int] = None
) extends Methodology

case object Methodology {
  val defaultMethodologies = List(ABTest())

  given Configuration = Configuration.default.withDiscriminator("name")
}
