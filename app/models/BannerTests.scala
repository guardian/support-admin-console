package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq


sealed trait BannerTemplate extends EnumEntry
object BannerTemplate extends Enum[BannerTemplate] with CirceEnum[BannerTemplate] {
  override val values: IndexedSeq[BannerTemplate] = findValues

  case object ContributionsBanner extends BannerTemplate
  case object DigitalSubscriptionsBanner extends BannerTemplate
  case object GuardianWeeklyBanner extends BannerTemplate
  case object G200Banner extends BannerTemplate
}

case class BannerContent(
  heading: Option[String],
  messageText: String,
  highlightedText: Option[String],
  cta: Option[Cta],
  secondaryCta: Option[Cta]
)

case class BannerVariant(
  name: String,
  template: BannerTemplate,
  bannerContent: Option[BannerContent],
  mobileBannerContent: Option[BannerContent],

  // Deprecated - use bannerContent / mobileBannerContent
  heading: Option[String],
  body: Option[String],
  highlightedText: Option[String],
  cta: Option[Cta],
  secondaryCta: Option[Cta]
)

case class BannerTest(
  name: String,
  nickname: Option[String],
  isOn: Boolean,
  minArticlesBeforeShowingBanner: Int,
  userCohort: UserCohort,
  locations: List[Region] = Nil,
  variants: List[BannerVariant],
  articlesViewedSettings: Option[ArticlesViewedSettings] = None,
  controlProportionSettings: Option[ControlProportionSettings] = None
)

case class BannerTests(tests: List[BannerTest])

object BannerTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val bannerTestDecoder = Decoder[BannerTest]
  implicit val bannerTestEncoder = Encoder[BannerTest]
  implicit val bannerTestsDecoder = Decoder[BannerTests]
  implicit val bannerTestsEncoder = Encoder[BannerTests]
}
