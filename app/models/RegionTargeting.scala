package models

case class RegionTargeting(
                            targetedRegions: List[Region]= Nil,
                            targetedCountries: Option[List[String]] = None,
                          )
