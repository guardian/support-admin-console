package models.promos

import com.gu.i18n.{Country, CountryGroup}

case class PromoCountryGroup(id: String, name: String, countries: List[String])

object PromoCountryGroups {
  // shortcut: 0.16 has older country groups. Remove these overrides when the aligned library is published.
  private val europeanCountryCodes = Set("AM", "AZ", "BY", "GE", "IC", "MD", "MK", "TR", "UA")

  val all: List[PromoCountryGroup] = List(
    PromoCountryGroup("ukm", "UK mainland", List(Country.UK.alpha2)),
    PromoCountryGroup("ukos", "UK overseas", CountryGroup.UK.countries.filter(_ != Country.UK).map(_.alpha2))
  ) ++ CountryGroup.allGroups.filterNot(_ == CountryGroup.UK).map { group =>
    val codes = group.countries.map(_.alpha2)
    val countries = group.id match {
      case "eu"  => (codes ++ europeanCountryCodes).distinct.sorted
      case "int" => codes.filterNot(europeanCountryCodes.contains)
      case _     => codes
    }
    PromoCountryGroup(group.id, group.name, countries)
  }

  val ids: Set[String] = all.map(_.id).toSet
}
