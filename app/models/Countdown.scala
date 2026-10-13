package models

import io.circe.derivation.{Configuration, ConfiguredCodec}

case class CountdownTheme(
    backgroundColor: String,
    foregroundColor: String
) derives ConfiguredCodec

object CountdownTheme {
  given Configuration = Configuration.default.withDefaults
}

case class CountdownSettings(
    overwriteHeadingLabel: String,
    countdownStartTimestamp: String,
    countdownDeadlineTimestamp: String,
    useLocalTime: Boolean,
    theme: CountdownTheme
) derives ConfiguredCodec

object CountdownSettings {
  given Configuration = Configuration.default.withDefaults
}
