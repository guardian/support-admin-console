package services

import org.scalatest.{EitherValues, FlatSpec, Matchers}
import services.S3Client.{RawVersionedS3Data, S3Action, S3ObjectSettings}
import gnieh.diffson.circe._
import models.SupportFrontendSwitches.{SupportFrontendSwitches, Switch, SwitchGroup}
import models._
import zio.{DefaultRuntime, IO}

import scala.concurrent.Await
import scala.concurrent.duration._

class S3JsonSpec extends FlatSpec with Matchers with EitherValues {

  val runtime = new DefaultRuntime {}

  val expectedJson: String =
    """
      |{
      |  "oneOffPaymentMethods" : {
      |    "description": "One-off payment methods",
      |    "switches": {
      |      "stripe" : {
      |        "state": "On",
      |        "description": "Stripe"
      |      },
      |      "payPal" : {
      |        "state": "On",
      |        "description": "PayPal"
      |      }
      |    }
      |  },
      |  "recurringPaymentMethods" : {
      |    "description": "Recurring payment methods",
      |    "switches": {
      |      "stripe" : {
      |        "state": "On",
      |        "description": "Stripe"
      |      },
      |      "payPal" : {
      |        "state": "On",
      |        "description": "PayPal"
      |      }
      |    }
      |  },
      |  "featureSwitches" : {
      |    "description": "Feature switches",
      |    "switches": {
      |      "enableQuantumMetric": {
      |        "state": "On",
      |        "description": "Enable Quantum Metric"
      |      },
      |      "checkoutPostcodeLookup": {
      |        "state": "On",
      |        "description": "Enable external service postcode lookup in checkout form"
      |      }
      |    }
      |  },
      |  "campaignSwitches": {
      |    "description": "Campaign switches",
      |    "switches": {
      |      "enableCampaign": {
      |        "state": "On",
      |        "description": "Enable contributions campaign"
      |      },
      |      "forceAll": {
      |        "state": "On",
      |        "description": "Force all users into the campaign"
      |      }
      |    }
      |  }
      |}
    """.stripMargin

  val expectedDecoded: VersionedS3Data[SupportFrontendSwitches] = VersionedS3Data(
    Map(
      "oneOffPaymentMethods" -> SwitchGroup(
        description = "One-off payment methods",
        switches = Map(
          "stripe" -> Switch("Stripe", On),
          "payPal" -> Switch("PayPal", On)
        )
      ),
      "recurringPaymentMethods" -> SwitchGroup(
        description = "Recurring payment methods",
        switches = Map(
          "stripe" -> Switch("Stripe", On),
          "payPal" -> Switch("PayPal", On)
        )
      ),
      "featureSwitches" -> SwitchGroup(
        description = "Feature switches",
        switches = Map(
          "enableQuantumMetric" -> Switch("Enable Quantum Metric", On),
          "checkoutPostcodeLookup" -> Switch("Enable external service postcode lookup in checkout form", On)
        )
      ),
      "campaignSwitches" -> SwitchGroup(
        description = "Campaign switches",
        switches = Map(
          "enableCampaign"-> Switch("Enable contributions campaign", On),
          "forceAll"-> Switch("Force all users into the campaign", On)
        )
      )
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
