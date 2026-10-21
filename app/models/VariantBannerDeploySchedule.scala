package models

import io.circe.{Decoder, DecodingFailure, Encoder}
import io.circe.generic.semiauto.deriveEncoder

case class VariantBannerDeploySchedule(daysOfWeek: List[Int])

object VariantBannerDeploySchedule {
  val default: VariantBannerDeploySchedule = VariantBannerDeploySchedule((0 to 6).toList)

  implicit val encoder: Encoder[VariantBannerDeploySchedule] = deriveEncoder

  implicit val decoder: Decoder[VariantBannerDeploySchedule] = Decoder.instance { cursor =>
    cursor.get[List[Int]]("daysOfWeek").flatMap { daysOfWeek =>
      val isValid = daysOfWeek.forall(day => day >= 0 && day <= 6) &&
        daysOfWeek.distinct.size == daysOfWeek.size

      if (isValid) {
        Right(VariantBannerDeploySchedule(daysOfWeek))
      } else {
        Left(DecodingFailure("Weekday indices must be unique values from 0 through 6", cursor.history))
      }
    }
  }
}
