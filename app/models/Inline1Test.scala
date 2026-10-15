package models

import io.circe.Codec
import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

case class Inline1Variant(
    name: String
) derives Codec.AsObject

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
) extends ChannelTest[Inline1Test] derives ConfiguredCodec {
  override def withChannel(channel: Channel): Inline1Test =
    this.copy(channel = Some(channel))

  override def withPriority(priority: Int): Inline1Test =
    this.copy(priority = Some(priority))
}

object Inline1Test {
  given Configuration = Configuration.default.withDefaults
}
