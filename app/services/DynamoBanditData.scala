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

/**
 * Models for data received from DynamoDb
 */

case class VariantSample(variantName: String, annualisedValueInGBP: Double, annualisedValueInGBPPerView: Double, views: Double)
case class TestSample(testName: String, variants: List[VariantSample], timestamp: String)
object TestSample {
  implicit val decoder = Decoder[TestSample]
  implicit val encoder = Encoder[TestSample]
}

/**
 * Models for data returned to the client
 */

// models the mean and views for each variant up to a certain timestamp
case class EnrichedVariantSampleData(variantName: String, views: Double, mean: Double)
case class EnrichedTestSampleData(timestamp: String, variants: List[EnrichedVariantSampleData])

// Final mean and views for a variant
case class VariantSummary(variantName: String, mean: Double, views: Double)

case class BanditData(variantSummaries: List[VariantSummary], samples: List[EnrichedTestSampleData])
object BanditData {
  implicit val decoder = Decoder[BanditData]
  implicit val encoder = Encoder[BanditData]
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

  private def sampleMean(samples: List[VariantSample], population: Double): Double =
    samples.foldLeft(0D)((acc, sample) =>
      acc + (sample.views / population) * sample.annualisedValueInGBPPerView
    )

  private def buildVariantSummaries(samples: List[TestSample]): List[VariantSummary] =
    samples
      .flatMap(_.variants)
      .groupBy(variantSample => variantSample.variantName)
      .map { case (variantName, samples) =>
        val population = samples.map(_.views).sum
        val mean = sampleMean(samples, population)
        VariantSummary(variantName = variantName, mean = mean, views = population)
      }
      .toList

  // For each hourly sample, calculate the means up to that point, so that we can visualise how the Bandit's view of the variants changed over time
  private def buildEnrichedSamples(samples: List[TestSample]): List[EnrichedTestSampleData] = {
    val samplesByVariant: Map[String, List[VariantSample]] = samples
      .flatMap(_.variants)
      .groupBy(variantSample => variantSample.variantName)

    samples
      .zipWithIndex
      .foldLeft(Array.empty[EnrichedTestSampleData]) { case (enrichedSamples, (sample, idx)) =>
        val variants = sample.variants.map(currentVariantSample => {
          val previousSamples = samplesByVariant(currentVariantSample.variantName).take(idx+1)

          val population = previousSamples.map(_.views).sum
          val mean = sampleMean(previousSamples, population)
          EnrichedVariantSampleData(currentVariantSample.variantName, currentVariantSample.views, mean)
        })

        enrichedSamples :+ EnrichedTestSampleData(sample.timestamp, variants)
      }
      .toList
  }

  def getDataForTest(testName: String, channel: String): ZIO[ZEnv, DynamoError, BanditData] =
    query(testName, channel)
      .map { results =>
        results.asScala
          .map(item => dynamoMapToJson(item).as[TestSample])
          .flatMap {
            case Right(row) => Some(row)
            case Left(error) =>
              logger.error(s"Failed to decode item from Dynamo: ${error.getMessage}")
              None
          }
          .toList
      }
      .map { samples: List[TestSample] =>
        val variantSummaries = buildVariantSummaries(samples)
        val enrichedSamples = buildEnrichedSamples(samples)

        BanditData(variantSummaries, enrichedSamples)
      }
}
