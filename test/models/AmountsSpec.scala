package models

import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import io.circe.syntax.EncoderOps
import models.Region.GBPCountries

class AmountsSpec extends AnyFlatSpec with Matchers with EitherValues {

  it should "decode amounts" in {
    decode[AmountsTestTargeting]("""{ "countryCodes": ["GB"] }""") should be(Right(CountryTargeting(List("GB"))))
    decode[AmountsTestTargeting]("""{ "region": "GBPCountries" }""") should be(Right(RegionTargeting(GBPCountries)))
  }

  it should "encode amounts" in {
    val countryTargeting: AmountsTestTargeting = CountryTargeting(List("GB"))
    countryTargeting.asJson.noSpaces should be("""{"countryCodes":["GB"]}""")

    val regionTargeting: AmountsTestTargeting = RegionTargeting(GBPCountries)
    regionTargeting.asJson.noSpaces should be("""{"region":"GBPCountries"}""")
  }
}
