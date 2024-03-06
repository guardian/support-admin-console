package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait BannerDesignStatus

object BannerDesignStatus {
  case object Live extends BannerDesignStatus

  case object Draft extends BannerDesignStatus

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[BannerDesignStatus]
  implicit val statusDecoder = deriveEnumerationDecoder[BannerDesignStatus]
}

case class HeaderImage(
  mobileUrl: String,
  tabletDesktopUrl: String,
  wideUrl: String,

  tabletUrl: String, // new
  desktopUrl: String, // new

  altText: String
)

sealed trait BannerDesignVisual
object BannerDesignVisual {
  case class Image(
    kind: String = "Image",
    mobileUrl: String,
    tabletDesktopUrl: String, // deprecated
    wideUrl: String, // deprecated

    tabletUrl: String = "https://i.guim.co.uk/img/media/cb654baf73bec78a73dbd656e865dedc3807ec74/0_0_300_300/300.jpg?width=300&height=300&quality=75&s=28324a5eb4f5f18eabd8c7b1a59ed150", // new
    desktopUrl: String = "https://i.guim.co.uk/img/media/058e7bd9d7a37983eb01cf981f67bd6efe42f95d/0_0_500_300/500.jpg?width=500&height=300&quality=75&s=632c02ed370780425b323aeb1e98cd80", // new

    altText: String
  ) extends BannerDesignVisual

  case class ChoiceCards(
    kind: String = "ChoiceCards",
    buttonColour: Option[HexColour],
    buttonTextColour: Option[HexColour],
    buttonBorderColour: Option[HexColour],
    buttonSelectColour: Option[HexColour],
    buttonSelectTextColour: Option[HexColour],
    buttonSelectBorderColour: Option[HexColour]
  ) extends BannerDesignVisual

  import io.circe.generic.extras.auto._
  implicit val customConfig: Configuration = Configuration.default.withDiscriminator("kind")
  implicit val encoder = Encoder[BannerDesignVisual]
  implicit val decoder = Decoder[BannerDesignVisual]
}

case class HexColour(
  r: String,
  g: String,
  b: String,
  kind: String,
)

case class BannerDesignBasicColours(
  background: HexColour,
  bodyText: HexColour,
  headerText: HexColour,
  articleCountText: HexColour,
  logo: HexColour
)

case class BannerDesignHighlightedTextColours(
  text: HexColour,
  highlight: HexColour
)

case class CtaStateDesign(
  text: HexColour,
  background: HexColour,
  border: Option[HexColour]
)

case class CtaDesign(
  default: CtaStateDesign,
  hover: CtaStateDesign
)

case class TickerDesign(
  text: HexColour,
  filledProgress: HexColour,
  progressBarBackground: HexColour,
  goalMarker: HexColour
)

case class BannerDesignColours(
  basic: BannerDesignBasicColours,
  highlightedText: BannerDesignHighlightedTextColours,
  primaryCta: CtaDesign,
  secondaryCta: CtaDesign,
  closeButton: CtaDesign,
  ticker: TickerDesign
)

case class BannerDesign(
  name: String,
  status: BannerDesignStatus,
  visual: Option[BannerDesignVisual],
  headerImage: Option[HeaderImage],
  colours: BannerDesignColours,
  lockStatus: Option[LockStatus],
)
