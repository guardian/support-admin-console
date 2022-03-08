package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq

case class HeaderContent(
  heading: String,
  subheading: String,
  primaryCta: Option[Cta],
  secondaryCta: Option[Cta],
)

case class HeaderVariant(
  name: String,
  content: HeaderContent,
  mobileContent: Option[HeaderContent],
)

case class HeaderTest(
  name: String,
  nickname: Option[String],
  isOn: Boolean,
  locations: List[Region] = Nil,
  userCohort: Option[UserCohort] = None,
  variants: List[HeaderVariant],
  controlProportionSettings: Option[ControlProportionSettings] = None,
  deviceType: Option[DeviceType] = None
)

case class HeaderTests(tests: List[HeaderTest])

object HeaderTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val headerTestDecoder = Decoder[HeaderTest]
  implicit val headerTestEncoder = Encoder[HeaderTest]
  implicit val headerTestsDecoder = Decoder[HeaderTests]
  implicit val headerTestsEncoder = Encoder[HeaderTests]
}
