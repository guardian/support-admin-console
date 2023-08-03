package models

case class BannerDesign(
    name: String,
    imageUrl: String,
    lockStatus: Option[LockStatus],
)

object BannerDesign {}
