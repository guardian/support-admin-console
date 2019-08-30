package services

import models._
import org.scalatest.{EitherValues, FlatSpec, Matchers}
import services.S3Client.RawVersionedS3Data
import io.circe.generic.auto._
import gnieh.diffson.circe._

import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration._

class S3JsonSpec extends FlatSpec with Matchers with EitherValues {
  val expectedJson =
    """
      |{
      |      "oneOffPaymentMethods": {
      |        "stripe": "On",
      |        "payPal": "On"
      |      },
      |      "recurringPaymentMethods": {
      |        "stripe": "On",
      |        "payPal": "On",
      |        "directDebit": "On",
      |        "existingCard": "On",
      |        "existingDirectDebit": "On"
      |      },
      |      "experiments": {
      |        "newFlow": {
      |          "name": "newFlow",
      |          "description": "Redesign of the payment flow UI",
      |          "state": "On"
      |        }
      |      },
      |      "optimize": "Off",
      |      "usStripeAccount": "On"
      |}
    """.stripMargin

  val expectedDecoded = VersionedS3Data(
    SupportFrontendSwitches(
      PaymentMethodsSwitch(On,On,None, None, None),
      PaymentMethodsSwitch(On,On,Some(On), Some(On), Some(On)),
      experiments = Map("newFlow" -> ExperimentSwitch("newFlow","Redesign of the payment flow UI",On)),
      optimize = Off,
      usStripeAccount = On
    ),
    version = "v1"
  )

  val dummyS3Client = new S3Client {
    def get(bucket: String, key: String)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
      Right {
        VersionedS3Data[String](
          expectedJson,
          "v1"
        )
      }
    }

    def put(bucket: String, key: String, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future(Right(data))
  }

  it should "decode from json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      S3Json.getFromJson[SupportFrontendSwitches]("bucket", "key")(dummyS3Client),
      1.second
    )

    result should be(Right(
      expectedDecoded
    ))
  }

  it should "encode as json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      S3Json.putAsJson[SupportFrontendSwitches]("bucket","key", expectedDecoded)(dummyS3Client),
      1.second
    )
    val diff = JsonDiff.diff(expectedJson, result.right.value.value, false)

    diff should be(JsonPatch(Nil))
  }
}
