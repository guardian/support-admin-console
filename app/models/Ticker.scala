package models
import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}

sealed trait TickerName derives ConfiguredEnumCodec
object TickerName {
  case object US extends TickerName
  case object AU extends TickerName
  case object global extends TickerName

  given Configuration = Configuration.default
}

case class TickerCopy(
    countLabel: String,
    goalCopy: String = "goal"
) derives ConfiguredCodec

object TickerCopy {
  given Configuration = Configuration.default.withDefaults
}

case class TickerSettings(
    currencySymbol: String,
    copy: TickerCopy,
    name: TickerName
) derives ConfiguredCodec

object TickerSettings {
  given Configuration = Configuration.default.withDefaults
}
