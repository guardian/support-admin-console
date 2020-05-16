package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq

sealed trait OphanProduct extends EnumEntry

object OphanProduct extends Enum[OphanProduct] with CirceEnum[OphanProduct] {
  override val values: IndexedSeq[OphanProduct] = findValues

  case object CONTRIBUTION extends Product
  case object RECURRING_CONTRIBUTION extends Product
  case object MEMBERSHIP_SUPPORTER extends Product
  case object MEMBERSHIP_PATRON extends Product
  case object MEMBERSHIP_PARTNER extends Product
  case object DIGITAL_SUBSCRIPTION extends Product
  case object PRINT_SUBSCRIPTION extends Product
}

case class BannerVariant(
  name: String,
  headline: Option[String],
  body: String,
  highlightedText: String,
  cta: Option[Cta],
  secondaryCta: Option[Cta],
  hasTicker: Boolean
)

case class BannerTest(
  name: String,
  nickname: Option[String],
  isOn: Boolean,
  minArticlesBeforeShowingBanner: Int,
  userCohort: UserCohort,
  products: Option[List[OphanProduct]],
  locations: List[Region] = Nil,
  variants: List[BannerVariant],
  articlesViewedSettings: Option[ArticlesViewedSettings] = None
) extends Test

case class BannerTests(tests: List[BannerTest])

object BannerTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTestDecoder = Decoder[BannerTest]
  implicit val bannerTestEncoder = Encoder[BannerTest]
  implicit val bannerTestsDecoder = Decoder[BannerTests]
  implicit val bannerTestsEncoder = Encoder[BannerTests]
}
