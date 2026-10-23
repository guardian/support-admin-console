package models

import io.circe.{Decoder, DecodingFailure, Encoder, Json}

case class VariantBannerDeploySchedule(
    daysOfWeek: List[Int],
    lastManualRedeployTimestamp: Option[Long] = None,
    manualRedeploysByRegion: Map[String, BannerDeployRegion] = Map.empty
)

object VariantBannerDeploySchedule {
  val default: VariantBannerDeploySchedule = VariantBannerDeploySchedule((0 to 6).toList, None)
  private val validRegions = Set("Australia", "EuropeanUnion", "RestOfWorld", "UnitedKingdom", "UnitedStates")

  private implicit val bannerDeployRegionEncoder: Encoder[BannerDeployRegion] =
    Encoder.forProduct2("timestamp", "email")(region => (region.timestamp, region.email))

  private implicit val bannerDeployRegionDecoder: Decoder[BannerDeployRegion] =
    Decoder.forProduct2("timestamp", "email")(BannerDeployRegion.apply)

  implicit val encoder: Encoder[VariantBannerDeploySchedule] = Encoder.instance { schedule =>
    val fields = List(
      "daysOfWeek" -> Json.fromValues(schedule.daysOfWeek.map(Json.fromInt))
    ) ++ schedule.lastManualRedeployTimestamp.map { timestamp =>
      "lastManualRedeployTimestamp" -> Json.fromLong(timestamp)
    } ++ Option
      .when(schedule.manualRedeploysByRegion.nonEmpty)(
        "manualRedeploysByRegion" -> Encoder[Map[String, BannerDeployRegion]].apply(
          schedule.manualRedeploysByRegion
        )
      )
      .toList

    Json.fromFields(fields)
  }

  implicit val decoder: Decoder[VariantBannerDeploySchedule] = Decoder.instance { cursor =>
    cursor.get[List[Int]]("daysOfWeek").flatMap { daysOfWeek =>
      cursor.get[Option[Long]]("lastManualRedeployTimestamp").flatMap { lastManualRedeployTimestamp =>
        cursor.get[Option[Map[String, BannerDeployRegion]]]("manualRedeploysByRegion").flatMap {
          maybeManualRedeploysByRegion =>
            val manualRedeploysByRegion = maybeManualRedeploysByRegion.getOrElse(Map.empty)
            val isValid = daysOfWeek.forall(day => day >= 0 && day <= 6) &&
              daysOfWeek.distinct.size == daysOfWeek.size &&
              lastManualRedeployTimestamp.forall(_ >= 0) &&
              manualRedeploysByRegion.forall { case (region, deploy) =>
                validRegions.contains(region) && deploy.timestamp >= 0
              }

            if (isValid) {
              Right(
                VariantBannerDeploySchedule(
                  daysOfWeek,
                  lastManualRedeployTimestamp,
                  manualRedeploysByRegion
                )
              )
            } else {
              Left(
                DecodingFailure(
                  "Weekday indices must be unique values from 0 through 6 and redeploy regions/timestamps must be valid",
                  cursor.history
                )
              )
            }
        }
      }
    }
  }
}
