package controllers

import org.scalatest.{FlatSpec, Matchers}

class BannerTestsControllerSpec extends FlatSpec with Matchers {
  it should "extract the banner test name" in {
    BannerTestsController.extractTestName("CODE/archived-banner-tests/my-test-name.json") should be(Some("my-test-name"))
  }

  it should "ignore if path with no file" in {
    BannerTestsController.extractTestName("CODE/archived-banner-tests/") should be(None)
  }
}
