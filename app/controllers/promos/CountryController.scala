package controllers.promos

import com.gu.i18n._
import play.api.libs.json._
import play.api.mvc.{AbstractController, Action, ActionBuilder, AnyContent, ControllerComponents}
import com.gu.googleauth.AuthAction

class CountryController(
    authAction: ActionBuilder[AuthAction.UserIdentityRequest, AnyContent],
    components: ControllerComponents
) extends AbstractController(components) {

  def all: Action[AnyContent] = authAction {
    implicit val countryWrites: Writes[Country] = new Writes[Country] {
      override def writes(in: Country): JsValue = JsString(in.alpha2)
    }

    implicit val curWrites: Writes[Currency] = new Writes[Currency] {
      override def writes(in: Currency): JsValue = JsString(in.glyph)
    }

    implicit val pcWrites: Writes[PostalCode] = new Writes[PostalCode] {
      override def writes(in: PostalCode): JsValue = JsString(in.name)
    }

    implicit val cgWrites: Writes[CountryGroup] = Json.writes[CountryGroup]

    val overseasCountries = CountryGroup.UK.countries.filter(_ != Country.UK)

    val mainlandUk = CountryGroup(
      "UK mainland",
      "ukm",
      Some(Country.UK),
      List(Country.UK),
      CountryGroup.UK.currency,
      PostCode
    )
    val overseasUk = CountryGroup(
      "UK overseas",
      "ukos",
      overseasCountries.headOption,
      overseasCountries,
      CountryGroup.UK.currency,
      PostCode
    )

    val countryGroups =
      List(mainlandUk, overseasUk) ++ CountryGroup.allGroups.filter(_ != CountryGroup.UK)

    Ok(Json.toJson[List[CountryGroup]](countryGroups))
  }
}
