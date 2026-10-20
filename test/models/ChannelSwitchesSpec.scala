package models

import io.circe.Encoder
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
      |  "enableInline1Tests": true,
      |  "enableMParticle": false,
      |  "enableAuxia": true,
      |  "enableAuxiaForBanners": true,
      |  "auxiaBannerRolloutPercentage": 50,
      |  "enableGandalfSignInGate": true
      |}
      |""".stripMargin

  private val legacyJson =
    """
      |{
      |  "enableEpics": true,
      |  "enableBanners": true,
      |  "enableSuperMode": false,
      |  "enableHardcodedEpicTests": false,
      |  "enableHardcodedBannerTests": false
      |}
      |""".stripMargin

  it should "decode a switch document that includes the Gandalf switch" in {
    val decoded = decode[ChannelSwitches](fullJson).toOption.get

    decoded.enableGandalfSignInGate shouldBe true
    decoded.auxiaBannerRolloutPercentage shouldBe 50
  }

  it should "default the Gandalf switch to off when absent, for backward compatibility with existing S3 documents" in {
    val decoded = decode[ChannelSwitches](legacyJson).toOption.get

    decoded.enableGandalfSignInGate shouldBe false
    decoded.enableAuxia shouldBe false
    decoded.auxiaBannerRolloutPercentage shouldBe 100
  }

  it should "accept rollout percentages from 0 through 100" in {
    List(0, 10, 50, 100).foreach { percentage =>
      val json = fullJson.replace(
        "\"auxiaBannerRolloutPercentage\": 50",
        s"\"auxiaBannerRolloutPercentage\": $percentage"
      )

      decode[ChannelSwitches](json).toOption.get.auxiaBannerRolloutPercentage shouldBe percentage
    }
  }

  it should "reject rollout percentages outside 0 through 100" in {
    List(-1, 101).foreach { percentage =>
      val json = fullJson.replace(
        "\"auxiaBannerRolloutPercentage\": 50",
        s"\"auxiaBannerRolloutPercentage\": $percentage"
      )

      decode[ChannelSwitches](json).isLeft shouldBe true
    }
  }

  it should "round-trip the Gandalf switch through the encoder" in {
    val decoded = decode[ChannelSwitches](fullJson).toOption.get
    val encoded = Encoder[ChannelSwitches].apply(decoded)
    val redecoded = decode[ChannelSwitches](encoded.noSpaces).toOption.get

    redecoded shouldBe decoded
    redecoded.enableGandalfSignInGate shouldBe true
    redecoded.auxiaBannerRolloutPercentage shouldBe 50
  }

  it should "default the Inline1 switch to off when absent, for backward compatibility with existing S3 documents" in {
    val decoded = decode[ChannelSwitches](legacyJson).toOption.get

    decoded.enableInline1Tests shouldBe false
  }

  it should "round-trip the Inline1 switch through the encoder" in {
    val decoded = decode[ChannelSwitches](fullJson).toOption.get
    val encoded = Encoder[ChannelSwitches].apply(decoded)
    val redecoded = decode[ChannelSwitches](encoded.noSpaces).toOption.get

    redecoded shouldBe decoded
    redecoded.enableInline1Tests shouldBe true
  }
}
