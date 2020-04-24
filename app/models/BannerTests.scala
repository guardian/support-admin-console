package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration

import scala.collection.immutable.IndexedSeq
import io.circe.generic.extras.auto._

case class AbTest(
  name: String,
  variant: String
)

object Product extends Enum[Product] with CirceEnum[Product] {
  override val values: IndexedSeq[Product] = findValues

  case object CONTRIBUTION extends Product
  case object RECURRING_CONTRIBUTION extends Product
  case object MEMBERSHIP_SUPPORTER extends Product
  case object MEMBERSHIP_PATRON extends Product
  case object MEMBERSHIP_PARTNER extends Product
  case object DIGITAL_SUBSCRIPTION extends Product
  case object PRINT_SUBSCRIPTION extends Product
}

case class BannerTest(
  campaignCode: String,
  pageviewId: String,
  products: List[Product],
  isHardcodedFallback: Boolean,
  minArticlesBeforeShowingBanner: Int,
  userCohort: UserCohort,
  bannerModifierClass: Option[String],
  abTest: AbTest,
  titles: Option[List[String]],
  leadSentence: Option[String],
  closingSentence: Option[String],
  messageText: String,
  ctaText: String,
  buttonCaption: String,
  linkUrl: String,
  hasTicker: Boolean,
  tickerHeader: Option[String],
  signInUrl: String,
  secondaryLinkUrl: Option[String],
  secondaryLinkLabel: Option[String],
  subsLinkUrl: Option[String],
  products: Option[List[Product]],
)

case class BannerTests(tests: List[BannerTest])

object BannerTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val epicTestsDecoder = Decoder[BannerTests]
  implicit val epicTestsEncoder = Encoder[BannerTests]
}
