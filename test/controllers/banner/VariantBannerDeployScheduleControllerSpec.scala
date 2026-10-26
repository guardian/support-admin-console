package controllers.banner

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class VariantBannerDeployScheduleControllerSpec extends AnyFlatSpec with Matchers {
  it should "return the all-days default with an empty version for a missing settings object" in {
    val result = VariantBannerDeployScheduleController.defaultSettings

    result.value.daysOfWeek shouldBe (0 to 6).toList
    result.value.lastManualRedeployTimestamp shouldBe None
    result.version shouldBe ""
  }
}
