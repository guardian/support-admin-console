package models

import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

case class BannerDeployRegion(timestamp: Long, email: String)

case class BannerDeploys(
  Australia: BannerDeployRegion,
  EuropeanUnion: BannerDeployRegion,
  RestOfWorld: BannerDeployRegion,
  UnitedKingdom: BannerDeployRegion,
  UnitedStates: BannerDeployRegion
)

object BannerDeploys {
  // implicit val encoder = Encoder[BannerDeploys]
  // implicit val decoder = Decoder[BannerDeploys]
}
