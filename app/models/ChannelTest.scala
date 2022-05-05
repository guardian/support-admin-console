package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{ deriveEnumerationDecoder, deriveEnumerationEncoder }

sealed trait Status {
  val name: String
}
case object Live extends Status { val name = "Live"}
case object Draft extends Status { val name = "Draft"}
case object Archived extends Status { val name = "Archived"}

object Status {
  def fromString(s: String): Option[Status] = s match {
    case Live.name => Some(Live)
    case Draft.name => Some(Draft)
    case Archived.name => Some(Archived)
    case _ => None
  }

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[Status]
  implicit val statusDecoder = deriveEnumerationDecoder[Status]
}

trait ChannelTest {
  val name: String
  val status: Option[Status]
  val lockStatus: Option[LockStatus]
  val priority: Option[Int]
}
