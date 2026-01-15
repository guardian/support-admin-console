package models

import io.circe.Decoder.Result
import io.circe.{Decoder, DecodingFailure, Encoder, HCursor, Json}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.semiauto.{deriveDecoder, deriveEnumerationDecoder, deriveEnumerationEncoder}

sealed trait Status

object Status {
  case object Live extends Status

  case object Draft extends Status

  case object Archived extends Status

  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val statusEncoder: Encoder[Status] = deriveEnumerationEncoder[Status]
  implicit val statusDecoder: Decoder[Status] = deriveEnumerationDecoder[Status]
}

trait ChannelTest[T] {
  val name: String
  val channel: Option[Channel] // optional only for the migration
  val status: Option[Status]
  val lockStatus: Option[LockStatus]
  val priority: Option[Int] // 0 is top priority
  val campaignName: Option[String]
  val methodologies: List[Methodology]

  def withChannel(channel: Channel): T
  def withPriority(priority: Int): T
}

object ChannelTest {
  import Channel._

  implicit def channelTestDecoder: Decoder[ChannelTest[_]] = new Decoder[ChannelTest[_]] {
    override def apply(c: HCursor): Result[ChannelTest[_]] = {
      c.downField("channel").as[Channel].flatMap {
        case Header             => HeaderTest.headerTestDecoder(c)
        case Banner1 | Banner2  => BannerTest.bannerTestDecoder(c)
        case GutterLiveblog     => GutterTest.gutterTestDecoder(c)
        case SupportLandingPage => SupportLandingPageTest.landingPageTestDecoder(c)
        case CheckoutNudge      => CheckoutNudgeTest.checkoutNudgeTestDecoder(c)
        case StudentLandingPage => StudentLandingPageTest.studentLandingPageTestDecoder(c)
        case epic               => EpicTest.epicTestDecoder(c)
      }
    }
  }

  implicit def channelTestEncoder: Encoder[ChannelTest[_]] = new Encoder[ChannelTest[_]] {
    override def apply(test: ChannelTest[_]): Json = test match {
      case header: HeaderTest                         => HeaderTest.headerTestEncoder(header)
      case banner: BannerTest                         => BannerTest.bannerTestEncoder(banner)
      case gutter: GutterTest                         => GutterTest.gutterTestEncoder(gutter)
      case landingPage: SupportLandingPageTest        => SupportLandingPageTest.landingPageTestEncoder(landingPage)
      case checkoutNudge: CheckoutNudgeTest => CheckoutNudgeTest.checkoutNudgeTestEncoder(checkoutNudge)
      case studentLandingPage: StudentLandingPageTest =>
        StudentLandingPageTest.studentLandingPageTestEncoder(studentLandingPage)
      case epic: EpicTest                   => EpicTest.epicTestEncoder(epic)
    }
  }
}
