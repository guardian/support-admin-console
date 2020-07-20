package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}


case class BannerVariant(
  name: String,
  heading: Option[String],
  body: String,
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
