package models

case class BannerDeployRegion(timestamp: Long, email: String)

case class BannerDeploys(
  Australia: BannerDeployRegion,
  EuropeanUnion: BannerDeployRegion,
  RestOfWorld: BannerDeployRegion,
  UnitedKingdom: BannerDeployRegion,
  UnitedStates: BannerDeployRegion
)
