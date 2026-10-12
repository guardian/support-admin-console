package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration

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
      buttonSelectBorderColour: Option[HexColour],
      buttonSelectMarkerColour: Option[HexColour],
      pillTextColour: Option[HexColour],
      pillBackgroundColour: Option[HexColour]
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

object HexColour {
  implicit val encoder: Encoder[HexColour] = io.circe.generic.semiauto.deriveEncoder[HexColour]
  implicit val decoder: Decoder[HexColour] = io.circe.generic.semiauto.deriveDecoder[HexColour]
}

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

object CtaStateDesign {
  implicit val encoder: Encoder[CtaStateDesign] = io.circe.generic.semiauto.deriveEncoder[CtaStateDesign]
  implicit val decoder: Decoder[CtaStateDesign] = io.circe.generic.semiauto.deriveDecoder[CtaStateDesign]
}

case class CtaDesign(
    default: CtaStateDesign
)

object CtaDesign {
  implicit val encoder: Encoder[CtaDesign] = io.circe.generic.semiauto.deriveEncoder[CtaDesign]
  implicit val decoder: Decoder[CtaDesign] = io.circe.generic.semiauto.deriveDecoder[CtaDesign]
}

case class TickerDesign(
    filledProgress: HexColour,
    progressBarBackground: HexColour,
    headlineColour: Option[HexColour], // new
    totalColour: Option[HexColour], // new
    goalColour: Option[HexColour] // new
)

object TickerDesign {
  import io.circe.generic.auto._
  implicit val encoder: Encoder[TickerDesign] = io.circe.generic.semiauto.deriveEncoder[TickerDesign]

  // Modify the Decoder to use existing values for the new fields
  private val normalDecoder: Decoder[TickerDesign] = io.circe.generic.semiauto.deriveDecoder[TickerDesign]
  implicit val decoder: Decoder[TickerDesign] = normalDecoder.map(design => {
    val headlineColour = design.headlineColour.getOrElse(design.filledProgress)
    val totalColour = design.totalColour.getOrElse(design.filledProgress)
    val goalColour = design.goalColour.getOrElse(design.filledProgress)
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

object BannerDesignColours {
  import io.circe.generic.auto._

  implicit val encoder: Encoder[BannerDesignColours] = io.circe.generic.semiauto.deriveEncoder[BannerDesignColours]
  implicit val decoder: Decoder[BannerDesignColours] = io.circe.generic.semiauto.deriveDecoder[BannerDesignColours]
}

case class BannerDesign(
    name: String,
    style: Option[String],
    colourTheme: Option[String],
    status: BannerDesignStatus,
    visual: Option[BannerDesignVisual],
    headerImage: Option[HeaderImage],
    colours: BannerDesignColours,
    lockStatus: Option[LockStatus],
    fonts: Option[Fonts]
)

object BannerDesign {
  import io.circe.generic.auto._

  implicit val encoder: Encoder[BannerDesign] = io.circe.generic.semiauto.deriveEncoder[BannerDesign]
  implicit val decoder: Decoder[BannerDesign] = io.circe.generic.semiauto.deriveDecoder[BannerDesign]
}
