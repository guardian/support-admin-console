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
      VariantBannerDeploySchedule(List(0, 2, 6), None)
    )
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[]}") shouldBe Right(
      VariantBannerDeploySchedule(Nil, None)
    )
  }

  it should "omit the manual redeploy timestamp until one is recorded" in {
    Encoder[VariantBannerDeploySchedule]
      .apply(VariantBannerDeploySchedule(List(0, 1), None))
      .noSpaces shouldBe "{\"daysOfWeek\":[0,1]}"
  }

  it should "round-trip regional redeploy timestamps and users" in {
    val schedule = VariantBannerDeploySchedule(
      List(0, 1),
      None,
      Map("UnitedKingdom" -> BannerDeployRegion(1_800_000_000_000L, "operator@example.com"))
    )
    val encoded = Encoder[VariantBannerDeploySchedule].apply(schedule)

    decode[VariantBannerDeploySchedule](encoded.noSpaces) shouldBe Right(schedule)
  }

  it should "reject out-of-range and duplicate weekday indices" in {
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[7]}").isLeft shouldBe true
    decode[VariantBannerDeploySchedule]("{\"daysOfWeek\":[1,1]}").isLeft shouldBe true
    decode[VariantBannerDeploySchedule](
      "{\"daysOfWeek\":[],\"lastManualRedeployTimestamp\":-1}"
    ).isLeft shouldBe true
    decode[VariantBannerDeploySchedule](
      "{\"daysOfWeek\":[],\"manualRedeploysByRegion\":{\"Unknown\":{\"timestamp\":1,\"email\":\"operator@example.com\"}}}"
    ).isLeft shouldBe true
    decode[VariantBannerDeploySchedule](
      "{\"daysOfWeek\":[],\"manualRedeploysByRegion\":{\"UnitedKingdom\":{\"timestamp\":-1,\"email\":\"operator@example.com\"}}}"
    ).isLeft shouldBe true
  }

  it should "round-trip the weekday schedule and manual redeploy timestamp through JSON" in {
    val schedule = VariantBannerDeploySchedule(List(1, 3, 5), Some(1_792_777_200_000L))
    val encoded = Encoder[VariantBannerDeploySchedule].apply(schedule)

    decode[VariantBannerDeploySchedule](encoded.noSpaces) shouldBe Right(schedule)
  }
}
