package models

import io.circe.{DecodingFailure, Json}
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import io.circe.syntax.EncoderOps
import models.BannerUI.{
  ContributionsBanner,
  BannerDesignName
}

import scala.language.postfixOps

class BannerTestsSpec extends AnyFlatSpec with Matchers with EitherValues {
  "decoding json" should "return a BannerDesignName when the json is an object with a name field" in {
    val rawJson =
      """
        |{
        |  "designName": "TEST_DESIGN"
        |}
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.value should be(BannerDesignName("TEST_DESIGN"))
  }

  it should "return the correct case object when the json is a string with a matching case class" in {
    val rawJson =
      """
        |"ContributionsBanner"
        |""".stripMargin

    val result = decode[BannerUI](rawJson)

    result.value should be(ContributionsBanner)
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

  "encoding json" should "return an object for a BannerDesignName" in {
    val bannerDesignName: BannerUI = BannerDesignName("TEST_DESIGN")

    val json = bannerDesignName.asJson

    val expectedJson = Json.obj(
      "designName" -> Json.fromString("TEST_DESIGN")
    )
    json should be(expectedJson)
  }

  it should "return a string for a named template" in {
    val template: BannerUI = ContributionsBanner

    val json = template.asJson

    json should be(Json.fromString("ContributionsBanner"))
  }
}
