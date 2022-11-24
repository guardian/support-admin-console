package services

import io.circe.{Decoder, Encoder}
import scalikejdbc._
import scalikejdbc.athena._
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

case class ArticleEpicData(views: Int, conversions: Int, avGBP: Long, timestamp: String, hour: Int)

object ArticleEpicData extends SQLSyntaxSupport[ArticleEpicData] {
  override val tableName = "members"
  def apply(rs: WrappedResultSet) = new ArticleEpicData(
    views = rs.long("views").toInt,
    conversions = rs.longOpt("conversions").map(_.toInt).getOrElse(0),
    avGBP = rs.longOpt("avGBP").getOrElse(0),
    timestamp = rs.string("timestamp"),
    hour = rs.long("hour").toInt
  )

  import io.circe.generic.auto._
  implicit val encoder = Encoder[ArticleEpicData]
  implicit val decoder = Decoder[ArticleEpicData]
}


class Athena() {
  def get(from: String, to: String, url: String): ZIO[ZEnv, Throwable, List[ArticleEpicData]] = {
    val fromDate = from.take(10)
    val toDate = to.take(10)

    effectBlocking {
      DB.athena { implicit s =>
        val r =
          sql"""
               |WITH views AS (
               |    SELECT date_hour, COUNT(*) AS views FROM acquisition.epic_views_prod
               |    WHERE date_hour >= timestamp $from AND date_hour < timestamp $to
               |    AND url=$url
               |    GROUP BY 1
               |),
               |acqs AS (
               |    SELECT
               |        from_iso8601_timestamp(concat(
               |            CAST(year(timestamp) AS varchar),
               |            '-',
               |            CAST(month(timestamp) AS varchar),
               |            '-',
               |            CAST(day(timestamp) AS varchar),
               |            'T',
               |            CAST(hour(timestamp) AS varchar),
               |            ':00:00'
               |        )) AS date_hour,
               |        annualisedvaluegbp
               |    FROM acquisition.acquisition_events_prod
               |    WHERE acquisition_date >= date $fromDate AND acquisition_date <= date $toDate
               |    AND referrerurl=$url
               |    AND timestamp >= timestamp $from AND timestamp < timestamp $to
               |),
               |acqs_grouped AS (
               |    SELECT date_hour, COUNT(*) AS conversions, SUM(annualisedvaluegbp) AS avGBP FROM acqs
               |    GROUP BY 1
               |)
               |SELECT *, date_hour AS timestamp, hour(date_hour) AS hour FROM views
               |FULL OUTER JOIN acqs_grouped USING (date_hour)
             """.stripMargin.map(rs => ArticleEpicData(rs)).list.apply().sortBy(_.timestamp)
         println(r)
         r
      }
    }
  }
}
