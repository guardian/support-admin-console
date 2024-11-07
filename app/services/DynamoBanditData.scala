package services

import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import models.DynamoErrors.{DynamoError, DynamoGetError}
import software.amazon.awssdk.services.dynamodb.DynamoDbClient
import software.amazon.awssdk.services.dynamodb.model.{AttributeValue, QueryRequest}
import utils.Circe.dynamoMapToJson
import io.circe.generic.auto._
import zio.blocking.effectBlocking
import zio.{ZEnv, ZIO}

import scala.jdk.CollectionConverters._

case class VariantSample(variantName: String, annualisedValueInGBP: Double, annualisedValueInGBPPerView: Double, views: Double)
case class TestSample(testName: String, variants: List[VariantSample], timestamp: String)

object TestSample {
  implicit val decoder = Decoder[TestSample]
  implicit val encoder = Encoder[TestSample]
}

case class VariantData(variantName: String, mean: Double, views: Double)
object VariantData {
  implicit val decoder = Decoder[VariantData]
  implicit val encoder = Encoder[VariantData]
}

class DynamoBanditData(stage: String, client: DynamoDbClient) extends StrictLogging {
  private val tableName = s"support-bandit-PROD"

  private def query(testName: String, channel: String): ZIO[ZEnv, DynamoGetError, java.util.List[java.util.Map[String, AttributeValue]]] = {
    effectBlocking {
      client.query(
        QueryRequest
          .builder()
          .tableName(tableName)
          .keyConditionExpression("testName = :testName")
          .expressionAttributeValues(Map(
            ":testName" -> AttributeValue.builder.s(s"${channel}_$testName").build
          ).asJava)
          .scanIndexForward(true)
          .build()
      ).items()
    }.mapError(DynamoGetError)
  }

  private def buildVariantData(samples: List[TestSample]): List[VariantData] = {
    samples
      .flatMap(_.variants)
      .groupBy(variantSample => variantSample.variantName)
      .map { case (variantName, samples) =>
        val population = samples.map(_.views).sum
        println(samples)
        val mean = samples.foldLeft(0D)((acc, sample) => acc + (sample.views / population) * sample.annualisedValueInGBPPerView)
        VariantData(variantName = variantName, mean = mean, views = population)
      }
      .toList
  }

  def getDataForTest(testName: String, channel: String): ZIO[ZEnv, DynamoError, List[VariantData]] = {
    query(testName, channel).map(results =>
      results.asScala
        .map(item => dynamoMapToJson(item).as[TestSample])
        .flatMap {
          case Right(row) => Some(row)
          case Left(error) =>
            logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
            None
        }
        .toList
    ).map(buildVariantData)
  }
}
