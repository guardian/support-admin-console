package services

import models._
import org.scalatest.{EitherValues, FlatSpec, Matchers}
import services.S3Client.{RawVersionedS3Data, S3ObjectSettings}
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
      |      "optimize": "Off"
      |}
    """.stripMargin

  val expectedDecoded = VersionedS3Data(
    SupportFrontendSwitches(
      PaymentMethodsSwitch(On,On,None, None, None),
      PaymentMethodsSwitch(On,On,Some(On), Some(On), Some(On)),
      experiments = Map("newFlow" -> ExperimentSwitch("newFlow","Redesign of the payment flow UI",On)),
      optimize = Off
    ),
    version = "v1"
  )

  val objectSettings = S3ObjectSettings(
    bucket = "bucket",
    key = "key",
    publicRead = false,
    cacheControl = None
  )

  val dummyS3Client = new S3Client {
    def get(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future {
      Right {
        VersionedS3Data[String](
          expectedJson,
          "v1"
        )
      }
    }

    def update(objectSettings: S3ObjectSettings, data: RawVersionedS3Data)(implicit ec: ExecutionContext): Future[Either[String,RawVersionedS3Data]] = Future(Right(data))

    def create(objectSettings: S3ObjectSettings, data: String)(implicit ec: ExecutionContext): Future[Either[String,String]] = Future(Right(data))

    def listKeys(objectSettings: S3ObjectSettings)(implicit ec: ExecutionContext): Future[Either[String, List[String]]] = Future(Right(Nil))
  }

  it should "decode from json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      S3Json.getFromJson[SupportFrontendSwitches](objectSettings)(dummyS3Client),
      1.second
    )

    result should be(Right(
      expectedDecoded
    ))
  }

  it should "encode as json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      S3Json.updateAsJson[SupportFrontendSwitches](objectSettings, expectedDecoded)(dummyS3Client),
      1.second
    )
    val diff = JsonDiff.diff(expectedJson, result.right.value.value, false)

    diff should be(JsonPatch(Nil))
  }
}
