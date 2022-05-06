package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

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

trait ChannelTest {
  val name: String
  val channel: Option[Channel] // optional only for the migration
  val status: Option[Status]
  val lockStatus: Option[LockStatus]
  val priority: Option[Int]
}

trait ChannelTests[T <: ChannelTest] {
  val tests: List[T]
}
