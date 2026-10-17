package models

import io.circe.Codec
import io.circe.derivation.ConfiguredCodec

case class NewsletterSignup(newsletterId: String, successDescription: String) derives Codec.AsObject
