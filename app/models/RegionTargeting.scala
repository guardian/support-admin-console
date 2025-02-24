package models

case class RegionTargeting(
  targetedCountryGroups: List[Region]= Nil,
  targetedCountryCodes: Option[List[String]] = None,
)
