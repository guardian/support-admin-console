package models

case class Amount(value: String, isDefault: Option[Boolean])

case class Amounts(ONE_OFF: List[Amount], MONTHLY: List[Amount], ANNUAL: List[Amount])

case class AmountsRegions(
  GBPCountries: Amounts,
  UnitedStates: Amounts,
  EURCountries: Amounts,
  AUDCountries: Amounts,
  International: Amounts,
  NZDCountries: Amounts,
  Canada: Amounts
)
