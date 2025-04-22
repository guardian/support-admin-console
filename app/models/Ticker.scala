package models
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait TickerCountType
object TickerCountType {
  case object money extends TickerCountType
  case object supporterCount extends TickerCountType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[TickerCountType]
  implicit val decoder = deriveEnumerationDecoder[TickerCountType]
}

sealed trait TickerName
object TickerName {
  case object US extends TickerName
  case object AU extends TickerName
  case object global extends TickerName

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[TickerName]
  implicit val decoder = deriveEnumerationDecoder[TickerName]
}

case class TickerCopy(
  countLabel: String,
  goalReachedPrimary: Option[String] , //deprecated
  goalReachedSecondary: Option[String] //deprecated
)

case class TickerSettings(
  countType: TickerCountType,
  currencySymbol: String,
  copy: TickerCopy,
  name: TickerName
)
