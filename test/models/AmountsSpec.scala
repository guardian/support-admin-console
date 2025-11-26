package models

import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import io.circe.syntax.EncoderOps
import models.Region.GBPCountries
import models.AmountsTestTargeting

class AmountsSpec extends AnyFlatSpec with Matchers with EitherValues {

  it should "decode amounts" in {
    decode[AmountsTestTargeting]("""{ "targetingType": "Country", "countries": ["GB"] }""") should be(
      Right(AmountsTestTargeting.Country(countries = List("GB")))
    )
    decode[AmountsTestTargeting]("""{ "targetingType": "Region", "region": "GBPCountries" }""") should be(
      Right(AmountsTestTargeting.Region(region = GBPCountries))
    )
  }

  it should "encode amounts" in {
    val countryTargeting: AmountsTestTargeting = AmountsTestTargeting.Country(countries = List("GB"))
    countryTargeting.asJson.noSpaces should be("""{"targetingType":"Country","countries":["GB"]}""")

    val regionTargeting: AmountsTestTargeting = AmountsTestTargeting.Region(region = GBPCountries)
    regionTargeting.asJson.noSpaces should be("""{"targetingType":"Region","region":"GBPCountries"}""")
  }
}
