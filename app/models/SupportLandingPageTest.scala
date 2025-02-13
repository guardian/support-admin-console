package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder, Json}
import models.Methodology.defaultMethodologies
case class  SupportLandingPageCopy(
                                       heading: String,
                                       subheading: String,
                                     )
case class  SupportLandingPageVariant(
                                       name: String,
                                       copy: SupportLandingPageCopy,
                                     )

case class SupportLandingPageTestTargeting(
                                            regionTargeting: RegionTargeting,
                                           )

case class SupportLandingPageTest(
                                   name: String,
                                   channel: Option[Channel],
                                   status: Option[Status],
                                   lockStatus: Option[LockStatus],
                                   priority: Option[Int],
                                   nickname: Option[String],
                                   targeting: SupportLandingPageTestTargeting,
                                   variants: List[SupportLandingPageVariant],
                                   campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
                                   methodologies: List[Methodology] = defaultMethodologies,
                                 ) extends ChannelTest[SupportLandingPageTest] {

  override def withChannel(channel: Channel): SupportLandingPageTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): SupportLandingPageTest =
    this.copy(priority = Some(priority))
}

object SupportLandingPageTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val landingPageTestDecoder: Decoder[SupportLandingPageTest] =
    deriveConfiguredDecoder[SupportLandingPageTest]
  implicit val landingPageTestEncoder: Encoder[SupportLandingPageTest] =
    deriveConfiguredEncoder[SupportLandingPageTest]
}


