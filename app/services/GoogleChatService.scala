package services

import com.typesafe.scalalogging.LazyLogging
import play.api.libs.ws.WSClient
import io.circe.generic.auto._
import io.circe.syntax._

import scala.concurrent.{ExecutionContext, Future}

/**
 * This class sends messages to a Google Chat webhook url.
 * We can use this for notifying people about changes made by the tools.
 */
class GoogleChatService(url: String, wsClient: WSClient)(implicit val ec: ExecutionContext) extends LazyLogging {
  case class Message(text: String)

  def sendMessage(message: String): Future[Unit] =
    wsClient
      .url(url)
      .post(Message(message).asJson.noSpaces)
      .map(response => {
        response.status match {
          case 200 => logger.info(s"Sent banner design update message to Chat")
          case _ => logger.error(s"Failed to send banner design message to Chat - status ${response.status}", response.body)
        }
      })
}
