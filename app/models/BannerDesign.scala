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

sealed trait GuardianRoundelDesign
object GuardianRoundelDesign {
  case object default extends GuardianRoundelDesign
  case object brand extends GuardianRoundelDesign
  case object inverse extends GuardianRoundelDesign

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[GuardianRoundelDesign]
  implicit val decoder = deriveEnumerationDecoder[GuardianRoundelDesign]
}

case class HeaderImage(
  mobileUrl: String,
  tabletDesktopUrl: String,
  wideUrl: String,
  altText: String
)

sealed trait BannerDesignVisual
object BannerDesignVisual {
  case class Image(
    kind: String = "Image",
    mobileUrl: String,
    tabletDesktopUrl: String,
    wideUrl: String,
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
  guardianRoundel: Option[GuardianRoundelDesign],
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
