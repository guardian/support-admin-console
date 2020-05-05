package models

import enumeratum.{CirceEnum, Enum, EnumEntry}

import scala.collection.immutable.IndexedSeq

sealed trait UserCohort extends EnumEntry

object UserCohort extends Enum[UserCohort] with CirceEnum[UserCohort] {
  override val values: IndexedSeq[UserCohort] = findValues

  case object AllExistingSupporters extends UserCohort
  case object AllNonSupporters extends UserCohort
  case object Everyone extends UserCohort
  case object PostAskPauseSingleContributors extends UserCohort
}
