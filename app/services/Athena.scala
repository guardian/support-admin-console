package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import scalikejdbc._
import scalikejdbc.athena._
import services.AthenaError.{AthenaError, AthenaQueryFailed, AthenaResultPending}
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}
import software.amazon.awssdk.services.athena.AthenaClient
import software.amazon.awssdk.services.athena.model.{GetQueryExecutionRequest, GetQueryResultsRequest, QueryExecutionContext, QueryExecutionState, ResultConfiguration, StartQueryExecutionRequest, StartQueryExecutionResponse}

import scala.jdk.CollectionConverters._

case class ArticleEpicData(views: Int, conversions: Int, avGBP: Double, timestamp: String, hour: Int)

object AthenaError {
  sealed trait AthenaError extends Throwable
  case object AthenaResultTimeout extends AthenaError {}
  case class AthenaQueryFailed(error: Throwable) extends AthenaError {
    override def getMessage = s"Error querying Athena: ${error.getMessage}"
  }
  case object AthenaResultPending extends AthenaError
}

object ArticleEpicData extends SQLSyntaxSupport[ArticleEpicData] {
  override val tableName = "members"
  def apply(rs: WrappedResultSet) = new ArticleEpicData(
    views = rs.long("views").toInt,
    conversions = rs.longOpt("conversions").map(_.toInt).getOrElse(0),
    avGBP = rs.doubleOpt("avGBP").getOrElse(0),
    timestamp = rs.string("timestamp"),
    hour = rs.long("hour").toInt
  )

  def apply(mapping: Map[String, String]): Option[ArticleEpicData] = {
    def parseInt(name: String): Int = mapping
      .get(name)
      .flatMap(Option(_)) // It could be null - wrap in Option
      .flatMap(_.toIntOption)
      .getOrElse(0)

    def parseDouble(name: String): Double = mapping
      .get(name)
      .flatMap(Option(_)) // It could be null - wrap in Option
      .flatMap(_.toDoubleOption)
      .getOrElse(0)

    for {
      timestamp <- mapping.get("timestamp")
    } yield new ArticleEpicData(
      views = parseInt("views"),
      conversions = parseInt("conversions"),
      avGBP = parseDouble("avGBP"),
      timestamp = timestamp,
      hour = parseInt("hour")
    )
  }

  import io.circe.generic.auto._
  implicit val encoder = Encoder[ArticleEpicData]
  implicit val decoder = Decoder[ArticleEpicData]
}


class Athena() extends StrictLogging {
  private val client = AthenaClient
    .builder()
    .credentialsProvider(Aws.credentialsProvider.build())
    .build()

  private val queryExecutionContext = QueryExecutionContext
    .builder()
    .database("acquisition")
    .build()

  private val resultConfiguration = ResultConfiguration
    .builder()
    .outputLocation("s3://gu-support-analytics/support-admin-console/")
    .build()

  type QueryExecutionId = String

  private def startQuery(from: String, to: String, url: String): ZIO[ZEnv, AthenaError, QueryExecutionId] = {
    val fromDate = from.take(10)
    val toDate = to.take(10)
    logger.info(s"Querying athena")

    val request = StartQueryExecutionRequest
      .builder()
      .queryString(
        s"""
          |WITH views AS (
          |    SELECT date_hour, COUNT(*) AS views FROM acquisition.epic_views_prod
          |    WHERE date_hour >= timestamp '$from' AND date_hour < timestamp '$to'
          |    AND url='$url'
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
          |    WHERE acquisition_date >= date '$fromDate' AND acquisition_date <= date '$toDate'
          |    AND referrerurl='$url'
          |    AND timestamp >= timestamp '$from' AND timestamp < timestamp '$to'
          |),
          |acqs_grouped AS (
          |    SELECT date_hour, COUNT(*) AS conversions, SUM(annualisedvaluegbp) AS avGBP FROM acqs
          |    GROUP BY 1
          |)
          |SELECT *, date_hour AS timestamp, hour(date_hour) AS hour FROM views
          |FULL OUTER JOIN acqs_grouped USING (date_hour)
                 """
          .stripMargin
      )
      .queryExecutionContext(queryExecutionContext)
      .resultConfiguration(resultConfiguration)
      .build()

    effectBlocking(client.startQueryExecution(request))
      .mapError(err => {
        logger.error(s"Query failed with: ${err.getMessage}")
        AthenaQueryFailed(err)
      })
      .map(_.queryExecutionId())
  }

  private def pollQueryResult(queryExecutionId: String): ZIO[ZEnv, AthenaError, QueryExecutionId] = {
    effectBlocking {
      val getQueryExecutionRequest = GetQueryExecutionRequest.builder().queryExecutionId(queryExecutionId).build()
      val getQueryExecutionResponse = client.getQueryExecution(getQueryExecutionRequest)
      getQueryExecutionResponse.queryExecution().status()
    }
      .mapError(err => AthenaQueryFailed(err))
      .flatMap { status =>
        status.state() match {
          case QueryExecutionState.SUCCEEDED => ZIO.succeed(queryExecutionId)
          case QueryExecutionState.RUNNING | QueryExecutionState.QUEUED => ZIO.fail(AthenaResultPending) // keep trying
          case _ => ZIO.fail(AthenaQueryFailed( // failed, stop polling
            new Throwable(status.stateChangeReason())
          ))
        }
      }
      .retryWhileEquals(AthenaResultPending)
  }

  private def getQueryResult(queryExecutionId: QueryExecutionId): ZIO[ZEnv, AthenaError, List[ArticleEpicData]] = {
    val request = GetQueryResultsRequest.builder().queryExecutionId(queryExecutionId).build()

    effectBlocking(client.getQueryResults(request))
      .mapError(err => AthenaQueryFailed(err))
      .map { response =>
        val columnNames = response.resultSet().resultSetMetadata().columnInfo().asScala.toList.map(_.name)
        response
          .resultSet()
          .rows()
          .asScala.toList
          .flatMap(row => {
            val values = row.data().asScala.toList.map(d => d.varCharValue())
            val data = ArticleEpicData(columnNames.zip(values).toMap)
            if (data.isEmpty) {
              logger.error(s"Failed to parse row from athena: $values")
            }
            data
          })
          .sortBy(_.timestamp)
      }
  }

  def get(from: String, to: String, url: String): ZIO[ZEnv, Throwable, List[ArticleEpicData]] =
    startQuery(from, to, url)
      .flatMap(pollQueryResult)
      .flatMap(getQueryResult)
      .tapError(error => ZIO.succeed(logger.error(s"Athena error: ${error.getMessage}")))
      .tap(result => ZIO.succeed(logger.info(s"Athena result: ${result.length}")))


  def get2(from: String, to: String, url: String): ZIO[ZEnv, Throwable, List[ArticleEpicData]] = {
    val fromDate = from.take(10)
    val toDate = to.take(10)
    logger.info(s"Querying athena")

    effectBlocking {
      DB.athena { implicit s =>
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
         """
          .stripMargin
          .map(rs => ArticleEpicData(rs))
          .list.apply()
          .sortBy(_.timestamp)
      }
    }
      .tapError(error => ZIO.succeed(logger.error(s"Athena error: ${error.getMessage}")))
      .tap(result => ZIO.succeed(logger.info(s"Athena result: ${result.length}")))
  }
}
