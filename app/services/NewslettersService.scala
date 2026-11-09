package services

import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

class NewslettersService(wsClient: WSClient)(implicit val ec: ExecutionContext) {
  def getNewsletters(): Future[String] =
    wsClient
      .url("https://newsletters.guardianapis.com/api/newsletters")
      .get()
      .map(response => response.body)
}
