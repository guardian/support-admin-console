package services

import play.api.libs.ws.WSClient

import scala.concurrent.{ExecutionContext, Future}

class CapiService(apiKey: String, wsClient: WSClient)(implicit val ec: ExecutionContext) {
  private val url = "https://content.guardianapis.com"

  private def request(path: String, querystring: String): Future[String] =
    wsClient
      .url(s"$url/$path?api-key=$apiKey&$querystring")
      .get()
      .map(response => response.body)

  def getTags(querystring: String): Future[String] = request("tags", querystring)

  def getSections(querystring: String): Future[String] = request("sections", querystring)
}
