package models

import io.circe.parser.decode
import io.circe.syntax._
import models.promos.{AppliesTo, PromoCountryGroups}
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class PromoTargetingSpec extends AnyFlatSpec with Matchers with EitherValues {
  "Promotion targeting" should "round-trip group IDs without storing expanded countries" in {
    val targeting = decode[AppliesTo]("""{"productRatePlanIds":[],"countryGroups":["eu","ukm"]}""").value

    targeting.countryGroups shouldBe Some(Set("eu", "ukm"))
    targeting.asJson.hcursor.downField("countries").succeeded shouldBe false
    decode[AppliesTo](targeting.asJson.noSpaces).value shouldBe targeting
  }

  it should "read legacy countries and reject unknown group IDs" in {
    decode[AppliesTo]("""{"productRatePlanIds":[],"countries":["FR"]}""").value.countries shouldBe Some(Set("FR"))
    decode[AppliesTo]("""{"productRatePlanIds":[],"countryGroups":["unknown"]}""").isLeft shouldBe true
  }

  it should "list the same countries in Europe as the support services" in {
    val europeanCountries = Set("AM", "AZ", "BY", "GE", "IC", "MD", "MK", "TR", "UA")
    val groups = PromoCountryGroups.all.map(group => group.id -> group.countries.toSet).toMap

    europeanCountries.subsetOf(groups("eu")) shouldBe true
    europeanCountries.intersect(groups("int")) shouldBe empty
  }
}
