package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq

sealed trait OphanProduct extends EnumEntry

object OphanProduct extends Enum[OphanProduct] with CirceEnum[OphanProduct] {
  override val values: IndexedSeq[OphanProduct] = findValues

  case object CONTRIBUTION extends OphanProduct
  case object RECURRING_CONTRIBUTION extends OphanProduct
  case object MEMBERSHIP_SUPPORTER extends OphanProduct
  case object MEMBERSHIP_PATRON extends OphanProduct
  case object MEMBERSHIP_PARTNER extends OphanProduct
  case object DIGITAL_SUBSCRIPTION extends OphanProduct
  case object PRINT_SUBSCRIPTION extends OphanProduct
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
)

case class BannerTests(tests: List[BannerTest])

object BannerTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTestDecoder = Decoder[BannerTest]
  implicit val bannerTestEncoder = Encoder[BannerTest]
  implicit val bannerTestsDecoder = Decoder[BannerTests]
  implicit val bannerTestsEncoder = Encoder[BannerTests]
}
