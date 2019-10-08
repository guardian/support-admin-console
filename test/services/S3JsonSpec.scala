package services

import models._
import org.scalatest.{EitherValues, FlatSpec, Matchers}
import services.S3Client.{RawVersionedS3Data, S3Action, S3ObjectSettings}
import io.circe.generic.auto._
import gnieh.diffson.circe._
import zio.IO

import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration._

class S3JsonSpec extends FlatSpec with Matchers with EitherValues {

  val runtime = new zio.Runtime[Unit] {
    val Environment = ()
    val Platform = zio.internal.PlatformLive.Default
  }

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
    def get: S3Action = { _ =>
      IO.succeed {
        VersionedS3Data[String](
          expectedJson,
          "v1"
        )
      }
    }

    def put(data: RawVersionedS3Data): S3Action = { _ =>
      IO.succeed(data)
    }
  }

  it should "decode from json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      runtime.unsafeRunToFuture {
        S3Json.getFromJson[SupportFrontendSwitches](dummyS3Client).apply(objectSettings)
      },
      1.second
    )

    result should be(expectedDecoded)
  }

  it should "encode as json" in {
    import ExecutionContext.Implicits.global

    val result = Await.result(
      runtime.unsafeRunToFuture {
        S3Json.putAsJson[SupportFrontendSwitches](expectedDecoded)(dummyS3Client).apply(objectSettings)
      },
      1.second
    )
    val diff = JsonDiff.diff(expectedJson, result.value, false)

    diff should be(JsonPatch(Nil))
  }
}
