package models

import io.circe.{Decoder, Encoder}
import utils.Circe.decodeStringAndCollect

sealed trait ContributionType
case object ONE_OFF extends ContributionType
case object MONTHLY extends ContributionType
case object ANNUAL extends ContributionType

case object ContributionType {
  implicit val contributionTypeEncoder: Encoder[ContributionType] = Encoder.encodeString.contramap[ContributionType] {
    case ONE_OFF => "ONE_OFF"
    case MONTHLY => "MONTHLY"
    case ANNUAL => "ANNUAL"
  }

  implicit val contributionTypeDecoder: Decoder[ContributionType] = decodeStringAndCollect {
    case "ONE_OFF" => ONE_OFF
    case "MONTHLY" => MONTHLY
    case "ANNUAL" => ANNUAL
  }
}

case class ContributionTypeSetting(contributionType: ContributionType, isDefault: Option[Boolean])

case class ContributionTypes(
  GBPCountries: Seq[ContributionTypeSetting],
  UnitedStates: Seq[ContributionTypeSetting],
  EURCountries: Seq[ContributionTypeSetting],
  International: Seq[ContributionTypeSetting],
  Canada: Seq[ContributionTypeSetting],
  AUDCountries: Seq[ContributionTypeSetting],
  NZDCountries: Seq[ContributionTypeSetting]
)
