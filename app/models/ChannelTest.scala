package models

import io.circe.Decoder.Result
import io.circe.derivation.{Configuration, ConfiguredCodec, ConfiguredEnumCodec}
import io.circe.syntax.*
import io.circe.{Decoder, Encoder, HCursor, Json}

sealed trait Status derives ConfiguredEnumCodec

object Status {
  case object Live extends Status

  case object Draft extends Status

  case object Archived extends Status

  given Configuration = Configuration.default
}

case class Scheduler(
    start: Option[String] = None, // ISO datetime "YYYY-MM-DDTHH:MM" in UTC, inclusive
    end: Option[String] = None // ISO datetime "YYYY-MM-DDTHH:MM" in UTC, inclusive
) derives ConfiguredCodec

object Scheduler {
  given Configuration = Configuration.default.withDefaults
}

trait ChannelTest[T] {
  val name: String
  val channel: Option[Channel] // optional only for the migration
  val status: Option[Status]
  val lockStatus: Option[LockStatus]
  val priority: Option[Int] // 0 is top priority
  val campaignName: Option[String]
  val methodologies: List[Methodology]
  val scheduler: Option[Scheduler]

  def withChannel(channel: Channel): T
  def withPriority(priority: Int): T
}

object ChannelTest {
  import Channel._

  implicit def channelTestDecoder: Decoder[ChannelTest[?]] = new Decoder[ChannelTest[?]] {
    override def apply(c: HCursor): Result[ChannelTest[?]] = {
      c.downField("channel").as[Channel].flatMap {
        case Header             => c.as[HeaderTest]
        case Banner1 | Banner2  => c.as[BannerTest]
        case GutterLiveblog     => c.as[GutterTest]
        case SupportLandingPage => c.as[SupportLandingPageTest]
        case CheckoutNudge      => c.as[CheckoutNudgeTest]
        case StudentLandingPage => c.as[StudentLandingPageTest]
        case OneTimeCheckout    => c.as[OneTimeCheckoutTest]
        case Inline1            => c.as[Inline1Test]
        case epic               => c.as[EpicTest]
      }
    }
  }

  implicit def channelTestEncoder: Encoder[ChannelTest[?]] = new Encoder[ChannelTest[?]] {
    override def apply(test: ChannelTest[?]): Json = test match {
      case header: HeaderTest                         => header.asJson
      case banner: BannerTest                         => banner.asJson
      case gutter: GutterTest                         => gutter.asJson
      case landingPage: SupportLandingPageTest        => landingPage.asJson
      case checkoutNudge: CheckoutNudgeTest           => checkoutNudge.asJson
      case studentLandingPage: StudentLandingPageTest => studentLandingPage.asJson
      case oneTimeCheckout: OneTimeCheckoutTest       => oneTimeCheckout.asJson
      case inline1: Inline1Test                       => inline1.asJson
      case epic: EpicTest                             => epic.asJson
    }
  }
}
