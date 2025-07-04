package models

case class MaxViews(
    maxViewsCount: Int,
    maxViewsDays: Int,
    minDaysBetweenViews: Int
)

case class ArticlesViewedSettings(
    minViews: Int,
    maxViews: Option[Int],
    periodInWeeks: Int,
    tagIds: List[String] = Nil
)
