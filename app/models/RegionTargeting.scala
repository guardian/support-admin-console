package models

case class RegionTargeting(
                            targetedCountryGroups: List[Region]= Nil,
                            targetedCountries: Option[List[String]] = None,
                          )
