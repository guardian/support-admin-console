package models

import io.circe.Encoder
import models.GroupedVariantViews.VariantName

case class VariantViews(dateHour: String, name: VariantName, views: Int)

case class GroupedVariantViews(dateHour: String, views: Map[VariantName, Int])

object VariantViews {
  def parse(mapping: Map[String, String]): Option[VariantViews] = {
    def parseInt(name: String): Option[Int] = mapping
      .get(name)
      .flatMap(Option(_)) // It could be null - wrap in Option
      .flatMap(_.toIntOption)

    for {
      dateHour <- mapping.get("date_hour")
      name <- mapping.get("variant")
      views <- parseInt("views")
    } yield new VariantViews(
      dateHour = dateHour,
      name = name,
      views = views
    )
  }
}

object GroupedVariantViews {
  type VariantName = String

  import io.circe.generic.auto._
  implicit val encoder = Encoder[GroupedVariantViews]
}
