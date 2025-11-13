package controllers.promos

import com.gu.i18n._
import play.api.libs.json._
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents}
import com.gu.googleauth.AuthAction

case class SimpleCountryGroup(id: String, name: String, countries: List[String])

class CountryController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents
) extends AbstractController(components) {

  def all: Action[AnyContent] = authAction {
    implicit val simpleCountryGroupWrites: Writes[SimpleCountryGroup] = Json.writes[SimpleCountryGroup]

    val overseasCountries = CountryGroup.UK.countries.filter(_ != Country.UK)

    val mainlandUk = SimpleCountryGroup(
      "ukm",
      "UK mainland",
      List(Country.UK.alpha2)
    )
    val overseasUk = SimpleCountryGroup(
      "ukos",
      "UK overseas",
      overseasCountries.map(_.alpha2)
    )

    val otherGroups = CountryGroup.allGroups
      .filter(_ != CountryGroup.UK)
      .map(cg => SimpleCountryGroup(cg.id, cg.name, cg.countries.map(_.alpha2)))

    val countryGroups = List(mainlandUk, overseasUk) ++ otherGroups

    Ok(Json.toJson[List[SimpleCountryGroup]](countryGroups))
  }
}
