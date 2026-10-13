package models

import io.circe.derivation.{Configuration, ConfiguredEnumCodec}

sealed trait Channel derives ConfiguredEnumCodec

object Channel {
  case object Epic extends Channel
  case object EpicAppleNews extends Channel
  case object EpicLiveblog extends Channel
  case object Banner1 extends Channel
  case object Banner2 extends Channel
  case object Header extends Channel
  case object GutterLiveblog extends Channel
  case object SupportLandingPage extends Channel
  case object CheckoutNudge extends Channel
  case object StudentLandingPage extends Channel
  case object OneTimeCheckout extends Channel

  given Configuration = Configuration.default
}
