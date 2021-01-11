package models

case class AmountsSelection(amounts: List[Int], defaultAmount: Int)

case class ContributionAmounts(
    ONE_OFF: AmountsSelection,
    MONTHLY: AmountsSelection,
    ANNUAL: AmountsSelection
)

case class AmountsTestVariant(name: String, amounts: ContributionAmounts)

case class AmountsTest(name: String, isLive: Boolean, variants: List[AmountsTestVariant])

case class ConfiguredRegionAmounts(control: ContributionAmounts, test: Option[AmountsTest])

case class ConfiguredAmounts(
    GBPCountries: ConfiguredRegionAmounts,
    UnitedStates: ConfiguredRegionAmounts,
    EURCountries: ConfiguredRegionAmounts,
    AUDCountries: ConfiguredRegionAmounts,
    International: ConfiguredRegionAmounts,
    NZDCountries: ConfiguredRegionAmounts,
    Canada: ConfiguredRegionAmounts
)
