package controllers

import org.scalatest.{FlatSpec, Matchers}

class S3ObjectsControllerSpec extends FlatSpec with Matchers {
  it should "extract the epic test name" in {
    S3ObjectsController.extractFilename("CODE/archived-epic-tests/my-test-name.json") should be(Some("my-test-name"))
  }

  it should "ignore if path with no file" in {
    S3ObjectsController.extractFilename("CODE/archived-epic-tests/") should be(None)
  }
}
