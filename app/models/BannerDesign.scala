package models

case class BannerDesignImage(
    mobileUrl: String,
    tabletDesktopUrl: String,
    wideUrl: String,
    altText: String
)

case class BannerDesign(
    name: String,
    image: BannerDesignImage,
    lockStatus: Option[LockStatus],
)

object BannerDesign {}
