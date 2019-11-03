package controllers

import org.scalatest.{FlatSpec, Matchers}

class EpicTestsControllerSpec extends FlatSpec with Matchers {
  it should "extract the epic test name" in {
    EpicTestsController.extractTestName("CODE/archived-epic-tests/my-test-name.json") should be(Some("my-test-name"))
  }

  it should "ignore if path with no file" in {
    EpicTestsController.extractTestName("CODE/archived-epic-tests/") should be(None)
  }
}
