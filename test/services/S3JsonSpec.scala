package services

import models._
import org.scalatest.{EitherValues, FlatSpec, Matchers}
import services.S3Client.{RawVersionedS3Data, S3Action, S3ObjectSettings}
import io.circe.generic.auto._
import gnieh.diffson.circe._
import zio.{DefaultRuntime, IO}

import scala.concurrent.Await
import scala.concurrent.duration._

class S3JsonSpec extends FlatSpec with Matchers with EitherValues {

  val runtime = new DefaultRuntime {}

  val expectedJson: String =
    """
      |{
      |      "oneOffPaymentMethods": {
      |        "stripe": "On",
      |        "stripeApplePay": "On",
      |        "stripePaymentRequestButton": "On",
      |        "payPal": "On",
      |        "amazonPay": "On"
      |      },
      |      "recurringPaymentMethods": {
      |        "stripe": "On",
      |        "stripeApplePay": "On",
      |        "stripePaymentRequestButton": "On",
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
      |      "enableDigitalSubGifting": "Off",
      |      "useDotcomContactPage": "Off",
      |      "enableRecaptchaBackend" : "On",
      |      "enableRecaptchaFrontend" : "On"
      |}
    """.stripMargin

  val expectedDecoded: VersionedS3Data[SupportFrontendSwitches] = VersionedS3Data(
    SupportFrontendSwitches(
      PaymentMethodSwitches(
        stripe = On,
        payPal = On,
        amazonPay = Some(On),
        directDebit = None,
        existingCard = None,
        existingDirectDebit = None,
        stripeApplePay = On,
        stripePaymentRequestButton = On
      ),
      PaymentMethodSwitches(
        stripe = On,
        payPal = On,
        amazonPay = None,
        directDebit = Some(On),
        existingCard = Some(On),
        existingDirectDebit = Some(On),
        stripeApplePay = On,
        stripePaymentRequestButton = On
      ),
      experiments = Map("newFlow" -> ExperimentSwitch("newFlow","Redesign of the payment flow UI",On)),
      enableDigitalSubGifting = Off,
      useDotcomContactPage = Off,
      enableRecaptchaBackend = On,
      enableRecaptchaFrontend = On
    ),
    version = "v1"
  )

  val objectSettings: S3ObjectSettings = S3ObjectSettings(
    bucket = "bucket",
    key = "key",
    publicRead = false,
    cacheControl = None
  )

  val dummyS3Client = new S3Client {
    var mockStore: Option[RawVersionedS3Data] = None

    def get: S3Action[RawVersionedS3Data] = { _ =>
      IO.succeed {
        VersionedS3Data[String](
          expectedJson,
          "v1"
        )
      }
    }
    def update(data: RawVersionedS3Data): S3Action[Unit] = _ => {
      mockStore = Some(data)
      IO.succeed(())
    }
    def createOrUpdate(data: String): S3Action[Unit] = _ => IO.succeed(())
    def listKeys: S3Action[List[String]] = _ => IO.succeed(Nil)
  }

  it should "decode from json" in {
    val result = Await.result(
      runtime.unsafeRunToFuture {
        S3Json.getFromJson[SupportFrontendSwitches](dummyS3Client).apply(objectSettings)
      },
      1.second
    )

    result should be(expectedDecoded)
  }

  it should "encode as json" in {
    Await.result(
      runtime.unsafeRunToFuture {
        S3Json.updateAsJson[SupportFrontendSwitches](expectedDecoded)(dummyS3Client).apply(objectSettings)
      },
      1.second
    )
    val diff = JsonDiff.diff(expectedJson, dummyS3Client.mockStore.get.value, false)

    diff should be(JsonPatch(Nil))
  }
}
