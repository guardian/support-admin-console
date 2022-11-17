package models
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait TickerEndType
object TickerEndType {
  case object unlimited extends TickerEndType
  case object hardstop extends TickerEndType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[TickerEndType]
  implicit val decoder = deriveEnumerationDecoder[TickerEndType]
}

sealed trait TickerCountType
object TickerCountType {
  case object money extends TickerCountType

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[TickerCountType]
  implicit val decoder = deriveEnumerationDecoder[TickerCountType]
}

sealed trait TickerName
object TickerName {
  case object US_2022 extends TickerName
  case object AU_2022 extends TickerName

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val encoder = deriveEnumerationEncoder[TickerName]
  implicit val decoder = deriveEnumerationDecoder[TickerName]
}

case class TickerCopy(
  countLabel: String,
  goalReachedPrimary: String,
  goalReachedSecondary: String
)

case class TickerSettings(
  endType: TickerEndType,
  countType: TickerCountType,
  currencySymbol: String,
  copy: TickerCopy,
  name: TickerName
)
