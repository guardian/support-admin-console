package utils

import io.circe.Json
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import io.circe.parser._
import software.amazon.awssdk.services.dynamodb.model.AttributeValue

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
    import diffson.lcs._
    import diffson.circe._
    import diffson.jsonpatch._
    import diffson.jsonpatch.lcsdiff._

    val initialJson: Json = parse(rawJson).toOption.get

    val dynamoAttributes: AttributeValue = Circe.jsonToDynamo(initialJson)

    val resultJson: Json = Circe.dynamoToJson(dynamoAttributes)

    implicit val patience = new Patience[Json]
    val jsonDiff = diffson.diff(resultJson, initialJson)

    jsonDiff should be(JsonPatch(Nil))
  }
}
