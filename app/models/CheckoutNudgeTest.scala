package models

import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import models.Methodology.defaultMethodologies

sealed trait ProductType derives ConfiguredEnumCodec

object ProductType {
  case object OneTimeContribution extends ProductType
  case object Contribution extends ProductType
  case object SupporterPlus extends ProductType
  case object DigitalSubscription extends ProductType

  given Configuration = Configuration.default
}

sealed trait RatePlan derives ConfiguredEnumCodec

object RatePlan {
  case object OneTime extends RatePlan
  case object Monthly extends RatePlan
  case object Annual extends RatePlan

  given Configuration = Configuration.default
}

case class Product(
    product: ProductType,
    ratePlan: Option[RatePlan] = None
) derives ConfiguredCodec

object Product {
  given Configuration = Configuration.default.withDefaults
}

case class Copy(
    heading: String,
    body: Option[String] = None
) derives ConfiguredCodec

object Copy {
  given Configuration = Configuration.default.withDefaults
}

case class Benefits(
    label: String
) derives ConfiguredCodec

object Benefits {
  given Configuration = Configuration.default.withDefaults
}

case class CheckoutNudgeVariant(
    name: String,
    nudge: Option[CheckoutNudge] = None,
    promoCodes: Option[List[String]] = None
) derives ConfiguredCodec

object CheckoutNudgeVariant {
  given Configuration = Configuration.default.withDefaults
}

case class CheckoutNudge(
    nudgeCopy: Copy,
    thankyouCopy: Copy,
    benefits: Option[Benefits] = None,
    nudgeToProduct: Product
) derives ConfiguredCodec

object CheckoutNudge {
  given Configuration = Configuration.default.withDefaults
}

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
    methodologies: List[Methodology] = defaultMethodologies,
    scheduler: Option[Scheduler] = None
) extends ChannelTest[CheckoutNudgeTest] derives ConfiguredCodec {

  override def withChannel(channel: Channel): CheckoutNudgeTest =
    this.copy(channel = Some(channel))
  override def withPriority(priority: Int): CheckoutNudgeTest =
    this.copy(priority = Some(priority))
}

object CheckoutNudgeTest {
  given Configuration = Configuration.default.withDefaults
}
