package services

import io.circe.Json
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import services.S3Client.{RawVersionedS3Data, S3Action, S3ObjectSettings}
import models.SupportFrontendSwitches.{SupportFrontendSwitches, Switch, SwitchGroup}
import models._
import org.scalatest.matchers.should.Matchers
import zio.{Unsafe, ZIO}

import scala.concurrent.Await
import scala.concurrent.duration._

class S3JsonSpec extends AnyFlatSpec with Matchers with EitherValues {

  val runtime = zio.Runtime.default

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
          "enableCampaign" -> Switch("Enable contributions campaign", On),
          "forceAll" -> Switch("Force all users into the campaign", On)
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
      ZIO.succeed {
        VersionedS3Data[String](
          expectedJson,
          "v1"
        )
      }
    }
    def update(data: RawVersionedS3Data): S3Action[Unit] = _ => {
      mockStore = Some(data)
      ZIO.succeed(())
    }
    def createOrUpdate(data: String): S3Action[Unit] = _ => ZIO.succeed(())
    def listKeys: S3Action[List[String]] = _ => ZIO.succeed(Nil)
  }

  it should "decode from json" in {
    val result = Await.result(
      Unsafe.unsafe { implicit unsafe =>
        runtime.unsafe.runToFuture {
          S3Json.getFromJson[SupportFrontendSwitches](dummyS3Client).apply(objectSettings)
        }
      },
      1.second
    )

    result should be(expectedDecoded)
  }

  it should "encode as json" in {
    import diffson.lcs._
    import diffson.circe._
    import diffson.jsonpatch._
    import diffson.jsonpatch.lcsdiff._
    import io.circe.parser._

    import SupportFrontendSwitches.SupportFrontendSwitchesEncoder
    val program = for {
      _ <- S3Json.updateAsJson[SupportFrontendSwitches](expectedDecoded)(dummyS3Client).apply(objectSettings)
      json <- dummyS3Client.get(objectSettings)
    } yield json

    val jsonFromClient: RawVersionedS3Data = Await.result(
      Unsafe.unsafe { implicit unsafe => runtime.unsafe.runToFuture(program) },
      1.second
    )

    implicit val patience = new Patience[Json]
    val jsonDiff = diffson.diff(
      parse(expectedJson).toOption.get,
      parse(jsonFromClient.value).toOption.get
    )

    jsonDiff should be(JsonPatch(Nil))
  }
}
