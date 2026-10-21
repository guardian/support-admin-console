package models

import io.circe.Encoder
import io.circe.parser.decode
import io.circe.syntax._
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class VariantBannerDeployScheduleSpec extends AnyFlatSpec with Matchers {
  it should "default to every weekday" in {
    VariantBannerDeploySchedule.default.daysOfWeek shouldBe (0 to 6).toList
  }

  it should "decode selected weekdays and allow an empty selection" in {
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[0,2,6]}") shouldBe Right(
      VariantBannerDeploySchedule(List(0, 2, 6))
    )
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[]}") shouldBe Right(
      VariantBannerDeploySchedule(Nil)
    )
  }

  it should "reject out-of-range and duplicate weekday indices" in {
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[7]}").isLeft shouldBe true
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[1,1]}").isLeft shouldBe true
  }

  it should "round-trip the weekday schedule through JSON" in {
    val schedule = VariantBannerDeploySchedule(List(1, 3, 5))
    val encoded = Encoder[VariantBannerDeploySchedule].apply(schedule)

    decode[VariantBannerDeploySchedule](encoded.noSpaces) shouldBe Right(schedule)
  }
}
