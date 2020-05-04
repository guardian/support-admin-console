package models

case class MaxViews(
  maxViewsCount: Int,
  maxViewsDays: Int,
  minDaysBetweenViews: Int
)

case class ArticlesViewedSettings(
 minViews: Option[Int],
 maxViews: Option[Int],
 periodInWeeks: Int
)
