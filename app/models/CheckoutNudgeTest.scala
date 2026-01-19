package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto._
import io.circe.syntax._
import models.Methodology.defaultMethodologies

sealed trait ProductType

object ProductType {
  case object OneTimeContribution extends ProductType
  case object Contribution extends ProductType
  case object SupporterPlus extends ProductType
  case object DigitalSubscription extends ProductType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[ProductType] = deriveEnumerationEncoder[ProductType]
  implicit val decoder: Decoder[ProductType] = deriveEnumerationDecoder[ProductType]
}

sealed trait RatePlan

object RatePlan {
  case object OneTime extends RatePlan
  case object Monthly extends RatePlan
  case object Annual extends RatePlan

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[RatePlan] = deriveEnumerationEncoder[RatePlan]
  implicit val decoder: Decoder[RatePlan] = deriveEnumerationDecoder[RatePlan]
}

case class Product(
    product: ProductType,
    ratePlan: Option[RatePlan] = None
)

case class Copy(
    heading: String,
    body: Option[String] = None
)

case class Benefits(
    label: String
)

case class CheckoutNudgeVariant(
    name: String,
    nudge: Option[CheckoutNudge] = None,
    promoCodes: Option[List[String]] = None
)

case class CheckoutNudge(
    nudgeCopy: Copy,
    thankyouCopy: Copy,
    benefits: Option[Benefits] = None,
    nudgeToProduct: Product
)

case class CheckoutNudgeTest(
    name: String,
    channel: Option[Channel],
    status: Option[Status],
    lockStatus: Option[LockStatus],
    priority: Option[Int],
    nickname: Option[String],
    regionTargeting: Option[RegionTargeting] = None,
    nudgeFromProduct: Product,
    variants: List[CheckoutNudgeVariant],
    campaignName: Option[String] = Some("NOT_IN_CAMPAIGN"),
    methodologies: List[Methodology] = defaultMethodologies
) extends ChannelTest[CheckoutNudgeTest] {

  override def withChannel(channel: Channel): CheckoutNudgeTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): CheckoutNudgeTest =
    this.copy(priority = Some(priority))
}

object CheckoutNudgeTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val checkoutNudgeTestDecoder: Decoder[CheckoutNudgeTest] =
    deriveConfiguredDecoder[CheckoutNudgeTest]
  implicit val checkoutNudgeTestEncoder: Encoder[CheckoutNudgeTest] =
    deriveConfiguredEncoder[CheckoutNudgeTest]
}
