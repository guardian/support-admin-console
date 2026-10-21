package models

import io.circe.Codec
import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

sealed trait Inline1Message derives ConfiguredCodec

case class Inline1SupportMessage(
    `type`: String = "Inline1SupportMessage",
    heading: String,
    body: String,
    primaryCta: Cta,
    image: Option[ResponsiveImage]
) extends Inline1Message

case class Inline1PuzzlesMessage(
    `type`: String = "Inline1PuzzlesMessage"
) extends Inline1Message

case class Inline1NewsletterMessage(
    `type`: String = "Inline1NewsletterMessage",
    newsletterId: String,
    frequency: String,
    heading: String,
    body: String,
    imageUrl: Option[String]
) extends Inline1Message

object Inline1Message {
  given Configuration = Configuration.default.withDiscriminator("type")
}

case class Inline1Variant(
    name: String,
    message: Inline1Message
) derives Codec.AsObject

case class Inline1Test(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    userCohort: Option[UserCohort] = None,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil, Nil, Nil, Nil),
    deviceType: Option[DeviceType] = None,
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    mParticleAudience: Option[Int] = None,
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
