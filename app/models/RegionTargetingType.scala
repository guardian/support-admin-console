package models

case class RegionTargetingType(
                     locations: List[Region] = Nil,
                     targetedCountries: List[String] = Nil,
                   )
