package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{ActionBuilder, AnyContent}
import play.api.mvc.Results.Ok
import services.CapiService

import scala.concurrent.ExecutionContext

class CapiController(authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent], capiService: CapiService)(
    implicit ec: ExecutionContext
) {

  def getTags() = authAction.async { request =>
    capiService
      .getTags(request.rawQueryString)
      .map(response => Ok(response))
  }

  def getSections() = authAction.async { request =>
    capiService
      .getSections(request.rawQueryString)
      .map(response => Ok(response))
  }

  def getContent(path: String) = authAction.async { request =>
    capiService
      .getContent(path)
      .map(response => Ok(response))
  }
}
