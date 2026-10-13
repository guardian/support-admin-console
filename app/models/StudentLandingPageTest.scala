package models

import io.circe.derivation.{Configuration, ConfiguredCodec}
import models.Methodology.defaultMethodologies

case class Institution(
    acronym: String,
    name: String,
    logoUrl: String
) derives ConfiguredCodec

object Institution {
  given Configuration = Configuration.default.withDefaults
}

case class ResponsiveImage(
    mobileUrl: String,
    tabletUrl: String,
    desktopUrl: String,
    altText: String
) derives ConfiguredCodec

object ResponsiveImage {
  given Configuration = Configuration.default.withDefaults
}

case class StudentLandingPageVariant(
    name: String,
    heading: String,
    subheading: String,
    institution: Institution,
    promoCodes: List[String],
    image: ResponsiveImage
) derives ConfiguredCodec

object StudentLandingPageVariant {
  given Configuration = Configuration.default.withDefaults
}

case class StudentLandingPageTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    countryGroupId: Region,
    variants: List[StudentLandingPageVariant],
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    methodologies: List[Methodology] = defaultMethodologies
) extends ChannelTest[StudentLandingPageTest] derives ConfiguredCodec {
  override val scheduler: Option[Scheduler] = None

  override def withChannel(channel: Channel): StudentLandingPageTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): StudentLandingPageTest =
    this.copy(priority = Some(priority))
}

object StudentLandingPageTest {
  given Configuration = Configuration.default.withDefaults
}
