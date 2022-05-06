package models

import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

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
  channel: Option[Channel],
  status: Option[Status],
  lockStatus: Option[LockStatus],
  priority: Option[Int],
  nickname: Option[String],
  isOn: Boolean,  // TODO - deprecate in favour of status
  locations: List[Region] = Nil,
  userCohort: Option[UserCohort] = None,
  variants: List[HeaderVariant],
  controlProportionSettings: Option[ControlProportionSettings] = None,
  deviceType: Option[DeviceType] = None
) extends ChannelTest

case class HeaderTests(tests: List[HeaderTest]) extends ChannelTests[HeaderTest]

object HeaderTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val headerTestDecoder = Decoder[HeaderTest]
  implicit val headerTestEncoder = Encoder[HeaderTest]
  implicit val headerTestsDecoder = Decoder[HeaderTests]
  implicit val headerTestsEncoder = Encoder[HeaderTests]
}
