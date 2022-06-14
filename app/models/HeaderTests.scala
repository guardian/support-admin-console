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
  deviceType: Option[DeviceType] = None,
  campaignName: Option[String]
) extends ChannelTest[HeaderTest] {

  override def withChannel(channel: Channel): HeaderTest = this.copy(channel = Some(channel))
  override def withPriority(priority: Int): HeaderTest = this.copy(priority = Some(priority))
}

object HeaderTest {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val headerTestDecoder = Decoder[HeaderTest]
  implicit val headerTestEncoder = Encoder[HeaderTest]
}
