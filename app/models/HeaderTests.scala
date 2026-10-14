package models

import io.circe.Codec
import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

case class HeaderContent(
    heading: String,
    subheading: String,
    primaryCta: Option[Cta],
    secondaryCta: Option[Cta]
) derives Codec.AsObject

case class HeaderVariant(
    name: String,
    content: HeaderContent,
    mobileContent: Option[HeaderContent],
    promoCodes: List[String] = Nil
) derives ConfiguredCodec

object HeaderVariant {
  given Configuration = Configuration.default.withDefaults
}

case class HeaderTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    locations: List[Region] = Nil,
    regionTargeting: Option[RegionTargeting] = None,
    userCohort: Option[UserCohort] = None,
    variants: List[HeaderVariant],
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    methodologies: List[Methodology] = defaultMethodologies,
    mParticleAudience: Option[Int] = None,
    scheduler: Option[Scheduler] = None
) extends ChannelTest[HeaderTest] derives ConfiguredCodec {

  override def withChannel(channel: Channel): HeaderTest = this.copy(channel = Some(channel))
  override def withPriority(priority: Int): HeaderTest = this.copy(priority = Some(priority))
}

object HeaderTest {
  given Configuration = Configuration.default.withDefaults
}
