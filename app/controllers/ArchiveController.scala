package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.StrictLogging
import io.circe.{Decoder, Encoder}
import io.circe.syntax._
import models.Test
import play.api.libs.circe.Circe
import play.api.mvc.{AnyContent, Result, Results}
import services.S3Client.S3ObjectSettings
import services.{S3Client, S3Json, VersionedS3Data}
import zio.blocking.Blocking
import zio.{DefaultRuntime, IO, ZIO}
import ArchiveController.extractTestName

import scala.concurrent.Future

object ArchiveController {
  // For extracting the test name from an S3 key
  private val testNamePattern = """^.*/([\w-].*)\.json$""".r

  def extractTestName(key: String): Option[String] = key match {
    case testNamePattern(testName) => Some(testName)
    case _ => None
  }
}

trait ArchiveController extends Circe with Results with StrictLogging {
  type T <: Test
  implicit val encoder: Encoder[T]
  implicit val decoder: Decoder[T]

  val authAction: AuthAction[AnyContent]
  val s3Client: S3Client
  val stage: String
  val name: String
  val runtime: DefaultRuntime

  private def run(f: => ZIO[Blocking, Throwable, Result]): Future[Result] =
    runtime.unsafeRunToFuture {
      f.catchAll { error =>
        IO.succeed(InternalServerError(error.getMessage))
      }
    }

  private def archiveObjectSettings(stage: String, name: String, fileName: String) = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/archived-$name/$fileName",
    publicRead = false
  )

  /**
    * Saves a single test to a new file. The file name will be the test's name.
    * Overwrites any existing archived test of the same name.
    * Removing the test from the current active tests list is done separately.
    */
  def archive = authAction.async(circe.json[T]) { request =>
    val testData = request.body
    val objectSettings = archiveObjectSettings(stage, name, s"${testData.name}.json")

    run {
      S3Json
        .createOrUpdateAsJson(testData)(s3Client)
        .apply(objectSettings)
        .map(_ => Ok("archived"))
        .mapError { error =>
          logger.error(s"Failed to archive test: $testData. Error was: $error")
          error
        }
    }
  }

  /**
    * Fetches all archived test file keys from S3 and returns just the test names
    */
  def archivedTestNames = authAction.async { request =>
    val objectSettings = archiveObjectSettings(stage, name, fileName = "")

    run {
      s3Client
        .listKeys(objectSettings)
        .map { keys =>
          val testNames: List[String] = keys.flatMap(extractTestName)
          Ok(S3Json.noNulls(testNames.asJson))
        }
        .mapError { error =>
          logger.error(s"Failed to fetch list of archived test names: $error")
          error
        }
    }
  }

  /**
    * Returns the archived test data for the given name
    */
  def getArchivedTest(testName: String) = authAction.async { request =>
    val objectSettings = archiveObjectSettings(stage, name, s"$testName.json")

    run {
      S3Json
        .getFromJson[T](s3Client)
        .apply(objectSettings)
        .map { case VersionedS3Data(test, _) => Ok(test.asJson) }
        .mapError { error =>
          logger.error(s"Failed to get archived test $testName: $error")
          error
        }
    }
  }
}
