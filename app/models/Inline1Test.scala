package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveConfiguredDecoder, deriveConfiguredEncoder}
import models.Methodology.defaultMethodologies

case class Inline1Variant(
  name: String
)

case class Inline1Test(
  name: String,
  channel: Option[Channel],
  status: Option[Status],
  lockStatus: Option[LockStatus],
  priority: Option[Int],
  nickname: Option[String],
  campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
  methodologies: List[Methodology] = defaultMethodologies,
  scheduler: Option[Scheduler] = None,
  variants: List[Inline1Variant]
) extends ChannelTest[Inline1Test] {
  override def withChannel(channel: Channel): Inline1Test =
    this.copy(channel = Some(channel))

  override def withPriority(priority: Int): Inline1Test =
    this.copy(priority = Some(priority))
}

object Inline1Test {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val inline1TestDecoder: Decoder[Inline1Test] = deriveConfiguredDecoder[Inline1Test]
  implicit val inline1TestEncoder: Encoder[Inline1Test] = deriveConfiguredEncoder[Inline1Test]
}
