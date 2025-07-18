package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}
import models.Methodology.defaultMethodologies

case class HeaderContent(
    heading: String,
    subheading: String,
    primaryCta: Option[Cta],
    secondaryCta: Option[Cta]
)

case class HeaderVariant(
    name: String,
    content: HeaderContent,
    mobileContent: Option[HeaderContent],
    promoCodes: List[String] = Nil
)

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
    methodologies: List[Methodology] = defaultMethodologies
) extends ChannelTest[HeaderTest] {

  override def withChannel(channel: Channel): HeaderTest = this.copy(channel = Some(channel))
  override def withPriority(priority: Int): HeaderTest = this.copy(priority = Some(priority))
}

object HeaderTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val headerTestDecoder: Decoder[HeaderTest] = deriveConfiguredDecoder[HeaderTest]
  implicit val headerTestEncoder: Encoder[HeaderTest] = deriveConfiguredEncoder[HeaderTest]
}
