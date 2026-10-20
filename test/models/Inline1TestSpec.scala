package models

import io.circe.parser.decode
import io.circe.syntax.*
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class Inline1TestSpec extends AnyFlatSpec with Matchers with EitherValues {
  private def decodeTest(message: String): Inline1Test =
    decode[Inline1Test](
      s"""
         |{
         |  "name":"inline-test",
         |  "channel":"Inline1",
         |  "status":"Draft",
         |  "lockStatus":null,
         |  "priority":null,
         |  "nickname":"Inline test",
         |  "message":$message,
         |  "variants":[{"name":"CONTROL","message":$message}]
         |}
         |""".stripMargin
    ).value

  "Inline1Test codecs" should "round-trip every message type offered by the editor" in {
    val tests = List(
      decodeTest(
        """{"type":"Inline1SupportMessage","heading":"Support us","body":"Body","primaryCta":{"text":"Support","baseUrl":"https://support.theguardian.com"},"imageUrl":"https://media.guim.co.uk/example.jpg"}"""
      ),
      decodeTest("""{"type":"Inline1PuzzlesMessage"}"""),
      decodeTest(
        """{"type":"Inline1NewsletterMessage","newsletterId":"example","frequency":"Weekly","heading":"Newsletter","body":"Body","imageUrl":null}"""
      )
    )

    val expectedTypes = List(
      "Inline1SupportMessage",
      "Inline1PuzzlesMessage",
      "Inline1NewsletterMessage"
    )
    tests.map(_.message.getClass.getSimpleName) shouldBe expectedTypes
    tests.map(_.variants.head.message.getClass.getSimpleName) shouldBe expectedTypes
    tests.foreach(test => test.asJson.as[Inline1Test].value shouldBe test)
  }
}
