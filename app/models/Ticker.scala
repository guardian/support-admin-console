package models
import io.circe.{Decoder, Encoder}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait TickerName
object TickerName {
  case object US extends TickerName
  case object AU extends TickerName
  case object global extends TickerName

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder: Encoder[TickerName] = deriveEnumerationEncoder[TickerName]
  implicit val decoder: Decoder[TickerName] = deriveEnumerationDecoder[TickerName]
}

case class TickerCopy(
    countLabel: String,
    goalCopy: String = "goal"
)

case class TickerSettings(
    currencySymbol: String,
    copy: TickerCopy,
    name: TickerName
)
