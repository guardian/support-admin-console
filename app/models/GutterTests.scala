package models

import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

case class GutterContent(
    image: Option[Image],
    bodyCopy: Option[List[String]],
    cta: Option[Cta]
) derives ConfiguredCodec

object GutterContent {
  given Configuration = Configuration.default.withDefaults
}

case class GutterVariant(
    name: String,
    content: Option[GutterContent],
    promoCodes: List[String] = Nil
) derives ConfiguredCodec

object GutterVariant {
  given Configuration = Configuration.default.withDefaults
}

case class GutterTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    userCohort: UserCohort,
    locations: List[Region] = Nil,
    regionTargeting: Option[RegionTargeting] = None,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil, Nil, Nil, Nil),
    variants: List[GutterVariant],
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    methodologies: List[Methodology] = defaultMethodologies,
    scheduler: Option[Scheduler] = None
) extends ChannelTest[GutterTest] derives ConfiguredCodec {

  override def withChannel(channel: Channel): GutterTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): GutterTest =
    this.copy(priority = Some(priority))
}

object GutterTest {
  given Configuration = Configuration.default.withDefaults
}
