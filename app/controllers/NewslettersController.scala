package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{ActionBuilder, AnyContent}
import play.api.mvc.Results.Ok
import services.NewslettersService

import scala.concurrent.ExecutionContext

class NewslettersController(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent], newslettersService: NewslettersService)(
    implicit ec: ExecutionContext
) {
  def getNewsletters() = authAction.async { request =>
    newslettersService
      .getNewsletters()
      .map(response => Ok(response))
  }
}
