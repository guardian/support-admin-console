package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.generic.extras.semiauto._
import io.circe.{Decoder, Encoder}
import models.Methodology.defaultMethodologies

case class SupportLandingPageCopy(
    heading: String,
    subheading: String
)

case class ProductBenefit(
    copy: String,
    tooltip: Option[String] = None,
    label: Option[Label] = None
)

case class Label(
    copy: String
)

case class LandingPageProductDescription(
    title: String,
    label: Option[Label] = None,
    benefits: List[ProductBenefit],
    cta: LandingPageCta
)

case class LandingPageCta(
    copy: String
)

case class Products(
    Contribution: LandingPageProductDescription,
    SupporterPlus: LandingPageProductDescription,
    TierThree: LandingPageProductDescription
)

case class DefaultProductSelection(
    productType: String,
    billingPeriod: String
)

case class SupportLandingPageVariant(
    name: String,
    copy: SupportLandingPageCopy,
    products: Products,
    tickerSettings: Option[TickerSettings] = None,
    countdownSettings: Option[CountdownSettings] = None,
    defaultProductSelection: Option[DefaultProductSelection] = None
)

case class SupportLandingPageTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    variants: List[SupportLandingPageVariant],
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    methodologies: List[Methodology] = defaultMethodologies
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
