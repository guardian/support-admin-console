package models

import java.time.OffsetDateTime

case class LockStatus(locked: Boolean, email: Option[String], timestamp: Option[OffsetDateTime])

object LockStatus {
  val unlocked = LockStatus(locked = false, None, None)
  def locked(email: String) = LockStatus(locked = true, Some(email), Some(OffsetDateTime.now))
}
