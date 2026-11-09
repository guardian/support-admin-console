package services

import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class BigQueryServiceSpec extends AnyFlatSpec with Matchers {
  "buildQuery" should "use a named parameter for the test name" in {
    val sql = BigQueryService.buildQuery("Epic").toOption.get
    sql should include("ab.name = @testName")
    sql should include("ACQUISITIONS_EPIC")
  }

  it should "return an error for an unknown channel" in {
    BigQueryService.buildQuery("x' OR '1'='1").isLeft shouldBe true
  }
}
