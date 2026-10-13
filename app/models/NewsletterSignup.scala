package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class NewsletterSignup(newsletterId: String, successDescription: String) derives ConfiguredCodec

object NewsletterSignup {
  given Configuration = Configuration.default.withDefaults
}
