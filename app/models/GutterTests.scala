package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder, Json}
import models.Methodology.defaultMethodologies

case class GutterContent(
    image: Option[Image],
    bodyCopy: Option[List[String]],
    cta: Option[Cta],
)

case class GutterVariant(
    name: String,
    gutterContent: Option[GutterContent],
)

case class GutterTest( // TODO: remove inappropriate ones.
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    userCohort: UserCohort,
    locations: List[Region] = Nil,
    contextTargeting: PageContextTargeting = PageContextTargeting(Nil,Nil,Nil,Nil), 
    variants: List[GutterVariant],
    controlProportionSettings: Option[ControlProportionSettings] = None,
    deviceType: Option[DeviceType] = None,
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    signedInStatus: Option[SignedInStatus] = Some(SignedInStatus.All),
    consentStatus: Option[ConsentStatus] = Some(ConsentStatus.All),
    methodologies: List[Methodology] = defaultMethodologies
)extends ChannelTest[GutterTest] {

  override def withChannel(channel: Channel): GutterTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): GutterTest =
    this.copy(priority = Some(priority))
}

object GutterTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val gutterTestDecoder: Decoder[GutterTest] =
    deriveConfiguredDecoder[GutterTest]
  implicit val gutterTestEncoder: Encoder[GutterTest] =
    deriveConfiguredEncoder[GutterTest]
}