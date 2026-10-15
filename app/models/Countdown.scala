package models

import io.circe.Codec
import io.circe.derivation.ConfiguredCodec

case class CountdownTheme(
    backgroundColor: String,
    foregroundColor: String
) derives Codec.AsObject

case class CountdownSettings(
    overwriteHeadingLabel: String,
    countdownStartTimestamp: String,
    countdownDeadlineTimestamp: String,
    useLocalTime: Boolean,
    theme: CountdownTheme
) derives Codec.AsObject
