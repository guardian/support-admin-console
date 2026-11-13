package controllers.promos

import models.promos.{PromoCountryGroup, PromoCountryGroups}
import play.api.libs.json._
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents}
import com.gu.googleauth.AuthAction

class CountryController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents
) extends AbstractController(components) {

  def all: Action[AnyContent] = authAction {
    implicit val countryGroupWrites: Writes[PromoCountryGroup] = Json.writes[PromoCountryGroup]
    Ok(Json.toJson(PromoCountryGroups.all))
  }
}
