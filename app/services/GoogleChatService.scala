package services

import com.typesafe.scalalogging.LazyLogging
import play.api.libs.ws.WSClient
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}

import io.circe.{Encoder, Json}

// Model for the payload we send to Google Chat API - https://developers.google.com/workspace/chat/create-messages
object GoogleChatMessage {
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
      case TextParagraph(text) => Json.obj("textParagraph" -> Json.obj("text" -> text.asJson))
      case ButtonList(buttons) => Json.obj("buttonList" -> Json.obj("buttons" -> buttons.asJson))
      case Image(imageUrl, altText) => Json.obj("image" -> Json.obj("imageUrl" -> imageUrl.asJson, "altText" -> altText.asJson))
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
}

/**
 * This class sends messages to a Google Chat webhook url.
 * We can use this for notifying people about changes made by the tools.
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
          case _ => logger.error(s"Failed to send banner design message to Chat - status ${response.status}", response.body)
        }
      })
}
