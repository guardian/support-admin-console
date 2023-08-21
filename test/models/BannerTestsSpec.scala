package models

import io.circe.{DecodingFailure, Json}
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import models.BannerUI.{BannerDesignName, Scotus2023MomentBanner}

import scala.language.postfixOps

class BannerTestsSpec extends AnyFlatSpec with Matchers with EitherValues {
  "decoding json" should "return a BannerDesignName when the json is an object with a name field" in {
    val rawJson =
      """
        |{
        |  "name": "TEST_DESIGN"
        |}
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.value should be(BannerDesignName("TEST_DESIGN"))
  }

  it should "return the correct case object when the json is a string with a matching case class" in {
    val rawJson =
      """
        |"Scotus2023MomentBanner"
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.value should be(Scotus2023MomentBanner)
  }

  it should "return an error when the json is a string with no matching case class" in {
    val rawJson =
      """
        |"FooBarBaz"
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.left.value shouldBe a[DecodingFailure]
  }

  it should "return an error when the json is an object of the wrong shape" in {
    val rawJson =
      """
        |{
        |  "foo": "bar"
        |}
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.left.value shouldBe a[DecodingFailure]
  }
}
