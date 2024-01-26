package utils

import io.circe.Json
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import io.circe.syntax.EncoderOps
import models.{BannerTest, BannerUI, BannerVariant}
import models.Channel.Banner1
import models.Status.Draft
import models.UserCohort.AllNonSupporters
import software.amazon.awssdk.services.dynamodb.model.AttributeValue
import diffson.lcs._
import diffson.circe._
import diffson.jsonpatch._
import diffson.jsonpatch.lcsdiff._

class CirceSpec extends AnyFlatSpec with Matchers with EitherValues {
  val rawJson =
    """
      |{
      |  "stringField": "foo",
      |  "numberField": 1,
      |  "boolField": true,
      |  "objectField": {
      |    "nestedStringField": "bar"
      |  },
      |  "arrayField": [1,3]
      |}
      |""".stripMargin

  it should "convert json to dynamo attributes, and back again" in {
    val initialJson: Json = parse(rawJson).toOption.get

    val dynamoAttributes: AttributeValue = Circe.jsonToDynamo(initialJson)

    val resultJson: Json = Circe.dynamoToJson(dynamoAttributes)

    implicit val patience = new Patience[Json]
    val jsonDiff = diffson.diff(resultJson, initialJson)

    jsonDiff should be(JsonPatch(Nil))
  }

  it should "drop nulls when serializing to dynamo attributes" in {
    // The model contains None values, which will be serialized to JSON nulls and then dropped
    val bannerTest = BannerTest(
      name = "test",
      channel = Some(Banner1),
      status = Some(Draft),
      lockStatus = None,
      priority = None,
      nickname = None,
      userCohort = AllNonSupporters,
      variants = List(
        BannerVariant(
          name = "variant1",
          template = BannerUI.ContributionsBanner,
          bannerContent = None,
          mobileBannerContent = None,
          separateArticleCount = None,
          tickerSettings = None
        )
      )
    )

    val expectedJsonWithNoNulls = parse(
      """
        |{
        |  "name" : "test",
        |  "channel" : "Banner1",
        |  "locations" : [],
        |  "status" : "Draft",
        |  "userCohort" : "AllNonSupporters",
        |  "campaignName" : "NOT_IN_CAMPAIGN",
        |  "variants" : [
        |    {
        |      "name" : "variant1",
        |      "template" : "ContributionsBanner"
        |    }
        |  ],
        |  "contextTargeting" : {
        |    "tagIds" : [],
        |    "sectionIds" : [],
        |    "excludedTagIds" : [],
        |    "excludedSectionIds" : []
        |  },
        |  "signedInStatus" : "All"
        |}
        |""".stripMargin
    ).toOption.get

    val jsonWithNulls = bannerTest.asJson

    val dynamoAttributes: AttributeValue = Circe.jsonToDynamo(jsonWithNulls)

    val resultJson: Json = Circe.dynamoToJson(dynamoAttributes)

    implicit val patience = new Patience[Json]
    val jsonDiff = diffson.diff(resultJson, expectedJsonWithNoNulls)

    jsonDiff should be(JsonPatch(Nil))
  }
}
