package models

import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}
import io.circe.generic.auto._

sealed trait Status

object Status {
  case object Live extends Status
  case object Draft extends Status
  case object Archived extends Status

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[Status]
  implicit val statusDecoder = deriveEnumerationDecoder[Status]
}

sealed trait Channel

object Channel {
  case object Epic extends Channel
  case object EpicAMP extends Channel
  case object EpicAppleNews extends Channel
  case object EpicLiveblog extends Channel
  case object EpicHoldback extends Channel
  case object Banner1 extends Channel
  case object Banner2 extends Channel
  case object Header extends Channel

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[Channel]
  implicit val statusDecoder = deriveEnumerationDecoder[Channel]
}

trait ChannelTest[T] {
  val name: String
  val channel: Option[Channel] // optional only for the migration
  val status: Option[Status]
  val lockStatus: Option[LockStatus]
  val priority: Option[Int] // 0 is top priority

  def withChannel(channel: Channel): T
  def withPriority(priority: Int): T
}

case class ChannelTests[T : Decoder : Encoder](tests: List[T])
