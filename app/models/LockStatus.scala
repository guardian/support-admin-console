package models

import java.time.OffsetDateTime
import io.circe.Decoder
import io.circe.Encoder
import io.circe.generic.semiauto._

case class LockStatus(locked: Boolean, email: Option[String], timestamp: Option[OffsetDateTime])

object LockStatus {
  val unlocked = LockStatus(locked = false, None, None)
  def locked(email: String) = LockStatus(locked = true, Some(email), Some(OffsetDateTime.now))
  implicit val decoder: Decoder[LockStatus] = deriveDecoder[LockStatus]
  implicit val encoder: Encoder[LockStatus] = deriveEncoder[LockStatus]
}
