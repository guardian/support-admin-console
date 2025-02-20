package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait Channel

object Channel {
  case object Epic extends Channel
  case object EpicAMP extends Channel
  case object EpicAppleNews extends Channel
  case object EpicLiveblog extends Channel
  case object Banner1 extends Channel
  case object Banner2 extends Channel
  case object Header extends Channel
  case object GutterLiveblog extends Channel
  case object SupportLandingPage extends Channel

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder = deriveEnumerationEncoder[Channel]
  implicit val statusDecoder = deriveEnumerationDecoder[Channel]
}
