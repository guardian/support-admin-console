package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.generic.extras.Configuration
import models.Methodology.defaultMethodologies

case class StudentLandingPageVariant(
    name: String,
    heading: String,
)

case class StudentLandingPageTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    variants: List[StudentLandingPageVariant],
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    methodologies: List[Methodology] = defaultMethodologies
) extends ChannelTest[StudentLandingPageTest] {

  override def withChannel(channel: Channel): StudentLandingPageTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): StudentLandingPageTest =
    this.copy(priority = Some(priority))
}

object StudentLandingPageTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val studentLandingPageTestDecoder: Decoder[StudentLandingPageTest] =
    deriveConfiguredDecoder[StudentLandingPageTest]
  implicit val studentLandingPageTestEncoder: Encoder[StudentLandingPageTest] =
    deriveConfiguredEncoder[StudentLandingPageTest]
}
