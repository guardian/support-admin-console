package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{
  deriveEnumerationDecoder,
  deriveEnumerationEncoder
}

sealed trait BannerDesignStatus

object BannerDesignStatus {
  case object Live extends BannerDesignStatus

  case object Draft extends BannerDesignStatus

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[BannerDesignStatus]
  implicit val statusDecoder = deriveEnumerationDecoder[BannerDesignStatus]
}

case class BannerDesignImage(
    mobileUrl: String,
    tabletDesktopUrl: String,
    wideUrl: String,
    altText: String
)

case class HexColour(
    r: String,
    g: String,
    b: String,
)

case class BannerDesignBasicColours(
    background: HexColour,
    bodyText: HexColour,
)

case class BannerDesignColours(
    basic: BannerDesignBasicColours,
)

case class BannerDesign(
    name: String,
    status: BannerDesignStatus,
    image: BannerDesignImage,
    colours: BannerDesignColours,
    lockStatus: Option[LockStatus],
)

object BannerDesign {}
