package models

import io.circe.{Decoder, DecodingFailure, Encoder, Json}

case class VariantBannerDeploySchedule(
    daysOfWeek: List[Int],
    lastManualRedeployTimestamp: Option[Long] = None
)

object VariantBannerDeploySchedule {
  val default: VariantBannerDeploySchedule = VariantBannerDeploySchedule((0 to 6).toList, None)

  implicit val encoder: Encoder[VariantBannerDeploySchedule] = Encoder.instance { schedule =>
    val fields = List(
      "daysOfWeek" -> Json.fromValues(schedule.daysOfWeek.map(Json.fromInt))
    ) ++ schedule.lastManualRedeployTimestamp.map { timestamp =>
      "lastManualRedeployTimestamp" -> Json.fromLong(timestamp)
    }

    Json.fromFields(fields)
  }

  implicit val decoder: Decoder[VariantBannerDeploySchedule] = Decoder.instance { cursor =>
    cursor.get[List[Int]]("daysOfWeek").flatMap { daysOfWeek =>
      cursor.get[Option[Long]]("lastManualRedeployTimestamp").flatMap { lastManualRedeployTimestamp =>
        val isValid = daysOfWeek.forall(day => day >= 0 && day <= 6) &&
          daysOfWeek.distinct.size == daysOfWeek.size &&
          lastManualRedeployTimestamp.forall(_ >= 0)

        if (isValid) {
          Right(VariantBannerDeploySchedule(daysOfWeek, lastManualRedeployTimestamp))
        } else {
          Left(
            DecodingFailure(
              "Weekday indices must be unique values from 0 through 6 and redeploy timestamps non-negative",
              cursor.history
            )
          )
        }
      }
    }
  }
}
