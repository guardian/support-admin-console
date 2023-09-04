package models

case class ContextTargeting(
  tagIds: List[String] = Nil,
  sectionIds: List[String] = Nil,
  excludedTagIds: List[String] = Nil,
  excludedSectionIds: List[String] = Nil,
)
