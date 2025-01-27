package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.auto._

case class ArchivedTestsRow(
channel: String,
name: String,
nickname: String,
priority: Double,
campaignName: String,
consentStatus: Array[String],
contextTargeting: String,
isBanditTest: Boolean,
locations: Array[String],
methodologies: Array[String],
signedInStatus: String,
userCohort: String,
variants: Array[String]
  )


object ArchivedTestsRow {
  implicit val encoder = Encoder[ArchivedTestsRow]
  implicit val decoder = Decoder[ArchivedTestsRow]
}
