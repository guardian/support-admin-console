package models

case class PageContextTargeting(
    tagIds: List[String] = Nil,
    sectionIds: List[String] = Nil,
    excludedTagIds: List[String] = Nil,
    excludedSectionIds: List[String] = Nil
)
