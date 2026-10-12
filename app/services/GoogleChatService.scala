package services

import com.typesafe.scalalogging.LazyLogging
import play.api.libs.ws.DefaultBodyWritables.writeableOf_String
import play.api.libs.ws.WSClient
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}

import io.circe.{Encoder, Json}

// Model for the payload we send to Google Chat API - https://developers.google.com/workspace/chat/create-messages
object GoogleChatMessage {
  private val generic = io.circe.generic.semiauto

  case class GoogleChatMessage(
      text: String,
      cardsV2: List[CardV2]
  )

  case class CardV2(
      cardId: String,
      card: Card
  )

  case class Card(
      header: CardHeader,
      sections: List[CardSection]
  )

  case class CardHeader(
      title: String,
      subtitle: String
  )

  case class CardSection(
      widgets: List[Widget]
  )

  sealed trait Widget

  object Widget {
    case class TextParagraph(text: String) extends Widget
    case class ButtonList(buttons: List[Button]) extends Widget
    case class Image(imageUrl: String, altText: String) extends Widget

    implicit val encodeWidget: Encoder[Widget] = Encoder.instance {
      case TextParagraph(text)      => Json.obj("textParagraph" -> Json.obj("text" -> text.asJson))
      case ButtonList(buttons)      => Json.obj("buttonList" -> Json.obj("buttons" -> buttons.asJson))
      case Image(imageUrl, altText) =>
        Json.obj("image" -> Json.obj("imageUrl" -> imageUrl.asJson, "altText" -> altText.asJson))
    }
  }

  case class Button(
      text: String,
      onClick: OnClick
  )

  case class OnClick(
      openLink: OpenLink
  )

  case class OpenLink(
      url: String
  )

  implicit val openLinkEncoder: Encoder[OpenLink] = generic.deriveEncoder[OpenLink]
  implicit val onClickEncoder: Encoder[OnClick] = generic.deriveEncoder[OnClick]
  implicit val buttonEncoder: Encoder[Button] = generic.deriveEncoder[Button]
  implicit val cardHeaderEncoder: Encoder[CardHeader] = generic.deriveEncoder[CardHeader]
  implicit val cardSectionEncoder: Encoder[CardSection] = generic.deriveEncoder[CardSection]
  implicit val cardEncoder: Encoder[Card] = generic.deriveEncoder[Card]
  implicit val cardV2Encoder: Encoder[CardV2] = generic.deriveEncoder[CardV2]
  implicit val googleChatMessageEncoder: Encoder[GoogleChatMessage] = generic.deriveEncoder[GoogleChatMessage]
}

/** This class sends messages to a Google Chat webhook url. We can use this for notifying people about changes made by
  * the tools.
  */
class GoogleChatService(url: String, wsClient: WSClient)(implicit val ec: ExecutionContext) extends LazyLogging {
  import GoogleChatMessage._

  def sendMessage(message: GoogleChatMessage): Future[Unit] =
    wsClient
      .url(url)
      .post(message.asJson.noSpaces)
      .map(response => {
        response.status match {
          case 200 => logger.info(s"Sent banner design update message to Chat")
          case _   =>
            logger.error(s"Failed to send banner design message to Chat - status ${response.status}", response.body)
        }
      })
}
