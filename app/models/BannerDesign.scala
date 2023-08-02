package models

case class BannerDesign(
    name: String,
    imageUrl: String,
    lockStatus: LockStatus,
)

object BannerDesign {}
