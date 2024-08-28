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
  tabletUrl: String,
  desktopUrl: String,
  altText: String
)

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
  text: HexColour, //deprecated
  filledProgress: HexColour,
  progressBarBackground: HexColour,
  goalMarker: HexColour, //deprecated
  headlineColour: Option[HexColour],  //new
  totalColour: Option[HexColour], //new
  goalColour: Option[HexColour] //new
)

object TickerDesign {
  import io.circe.generic.auto._
  implicit val encoder = Encoder[TickerDesign]

  // Modify the Decoder to use existing values for the new fields
  val normalDecoder = Decoder[TickerDesign]
  implicit val decoder = normalDecoder.map(design => {
    val headlineColour = design.headlineColour.getOrElse(design.text)
    val totalColour = design.totalColour.getOrElse(design.text)
    val goalColour = design.goalColour.getOrElse(design.text)
    design.copy(
      headlineColour = Some(headlineColour),
      totalColour = Some(totalColour),
      goalColour = Some(goalColour))
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
)
