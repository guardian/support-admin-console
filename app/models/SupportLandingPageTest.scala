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

object ProductBenefit {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[ProductBenefit] = deriveConfiguredDecoder[ProductBenefit]
  implicit val encoder: Encoder[ProductBenefit] = deriveConfiguredEncoder[ProductBenefit]
}

case class Label(
    copy: String
)

case class LandingPageProductDescription(
    title: String,
    titlePill: Option[String] = None,
    billingPeriodsCopy: Option[String] = None,
    label: Option[Label] = None,
    benefits: List[ProductBenefit],
    cta: LandingPageCta
)

object LandingPageProductDescription {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[LandingPageProductDescription] = deriveConfiguredDecoder[LandingPageProductDescription]
  implicit val encoder: Encoder[LandingPageProductDescription] = deriveConfiguredEncoder[LandingPageProductDescription]
}

case class LandingPageCta(
    copy: String
)

case class Products(
    Contribution: LandingPageProductDescription,
    SupporterPlus: LandingPageProductDescription,
    DigitalSubscription: Option[LandingPageProductDescription] = None
)

object Products {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[Products] = deriveConfiguredDecoder[Products]
  implicit val encoder: Encoder[Products] = deriveConfiguredEncoder[Products]
}

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

object SupportLandingPageVariant {
  import io.circe.generic.auto._

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val decoder: Decoder[SupportLandingPageVariant] = deriveConfiguredDecoder[SupportLandingPageVariant]
  implicit val encoder: Encoder[SupportLandingPageVariant] = deriveConfiguredEncoder[SupportLandingPageVariant]
}

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
    methodologies: List[Methodology] = defaultMethodologies,
    mParticleAudience: Option[Int] = None,
    scheduler: Option[Scheduler] = None
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
