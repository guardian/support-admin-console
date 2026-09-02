package models

import io.circe.parser._
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class ChannelSwitchesSpec extends AnyFlatSpec with Matchers with EitherValues {

  private val fullJson =
    """
      |{
      |  "enableEpics": true,
      |  "enableAppleNewsEpics": true,
      |  "enableBanners": true,
      |  "enableHeaders": true,
      |  "enableSuperMode": false,
      |  "enableHardcodedEpicTests": false,
      |  "enableHardcodedBannerTests": false,
      |  "enableScheduledBannerDeploys": true,
      |  "enableGutterLiveblogs": true,
      |  "enableMParticle": false,
      |  "enableAuxia": true,
      |  "enableAuxiaForBanners": true,
      |  "gandalfSignInGateCountries": ["NZ", "CA"]
      |}
      |""".stripMargin

  it should "decode a switch document that includes the Gandalf country list" in {
    val decoded = decode[ChannelSwitches](fullJson).toOption.get

    decoded.gandalfSignInGateCountries shouldBe List("NZ", "CA")
  }

  it should "default the Gandalf country list to empty when absent, for backward compatibility with existing S3 documents" in {
    val legacyJson =
      """
        |{
        |  "enableEpics": true,
        |  "enableBanners": true,
        |  "enableSuperMode": false,
        |  "enableHardcodedEpicTests": false,
        |  "enableHardcodedBannerTests": false
        |}
        |""".stripMargin

    val decoded = decode[ChannelSwitches](legacyJson).toOption.get

    decoded.gandalfSignInGateCountries shouldBe Nil
    decoded.enableAuxia shouldBe false
  }

  it should "round-trip the Gandalf country list through the encoder" in {
    val decoded = decode[ChannelSwitches](fullJson).toOption.get
    val encoded = ChannelSwitches.encoder.apply(decoded)
    val redecoded = decode[ChannelSwitches](encoded.noSpaces).toOption.get

    redecoded shouldBe decoded
    redecoded.gandalfSignInGateCountries shouldBe List("NZ", "CA")
  }
}
