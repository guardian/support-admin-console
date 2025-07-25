package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

sealed trait BannerDesignStatus

object BannerDesignStatus {
  case object Live extends BannerDesignStatus

  case object Draft extends BannerDesignStatus

  import io.circe.generic.extras.semiauto._
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder: Encoder[BannerDesignStatus] = deriveEnumerationEncoder[BannerDesignStatus]
  implicit val statusDecoder: Decoder[BannerDesignStatus] = deriveEnumerationDecoder[BannerDesignStatus]
}

case class HeaderImage(
    mobileUrl: String,
    tabletUrl: String,
    desktopUrl: String,
    altText: String
)

sealed trait FontSize
object FontSize {
  case object small extends FontSize
  case object medium extends FontSize
  case object large extends FontSize

  import io.circe.generic.extras.semiauto._
  implicit val decoder: Decoder[FontSize] = deriveEnumerationDecoder[FontSize]
  implicit val encoder: Encoder[FontSize] = deriveEnumerationEncoder[FontSize]
}
case class Font(size: FontSize)
case class Fonts(heading: Font)

sealed trait BannerDesignVisual
object BannerDesignVisual {
  case class Image(
      kind: String = "Image",
      mobileUrl: String,
      tabletUrl: String,
      desktopUrl: String,
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

  import io.circe.generic.extras.semiauto._
  implicit val encoder: Encoder[BannerDesignVisual] = deriveConfiguredEncoder[BannerDesignVisual]
  implicit val decoder: Decoder[BannerDesignVisual] = deriveConfiguredDecoder[BannerDesignVisual]
}

case class HexColour(
    r: String,
    g: String,
    b: String,
    kind: String
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
)

case class TickerDesign(
    text: HexColour, // deprecated
    filledProgress: HexColour,
    progressBarBackground: HexColour,
    goalMarker: HexColour, // deprecated
    headlineColour: Option[HexColour], // new
    totalColour: Option[HexColour], // new
    goalColour: Option[HexColour] // new
)

object TickerDesign {
  import io.circe.generic.auto._
  implicit val encoder: Encoder[TickerDesign] = deriveEncoder[TickerDesign]

  // Modify the Decoder to use existing values for the new fields
  private val normalDecoder: Decoder[TickerDesign] = deriveDecoder[TickerDesign]
  implicit val decoder: Decoder[TickerDesign] = normalDecoder.map(design => {
    val headlineColour = design.headlineColour.getOrElse(design.text)
    val totalColour = design.totalColour.getOrElse(design.text)
    val goalColour = design.goalColour.getOrElse(design.text)
    design.copy(headlineColour = Some(headlineColour), totalColour = Some(totalColour), goalColour = Some(goalColour))
  })
}

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
    fonts: Option[Fonts]
)
