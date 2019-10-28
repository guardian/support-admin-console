package controllers

import com.gu.googleauth.AuthAction
import play.api.mvc.{AnyContent, ControllerComponents}
import models.{EpicTest, EpicTests}
import EpicTestsController._
import play.api.libs.ws.WSClient
import services.{FastlyPurger, S3Json, VersionedS3Data}
import services.S3Client.S3ObjectSettings
import io.circe.generic.auto._
import io.circe.syntax._
import play.api.libs.circe.Circe

import scala.concurrent.ExecutionContext

object EpicTestsController {
  def fastlyPurger(stage: String, ws: WSClient)(implicit ec: ExecutionContext): Option[FastlyPurger] = {
    stage match {
      case "PROD" => Some(new FastlyPurger("https://support.theguardian.com/epic-tests.json", ws))
      case "CODE" => Some(new FastlyPurger("https://support.code.dev-theguardian.com/epic-tests.json", ws))
      case _ => None
    }
  }

  // For extracting the epic test name from an S3 key
  private val testNamePattern = """^.*/([\w-].*)\.json$""".r

  def extractTestName(key: String): Option[String] = key match {
    case EpicTestsController.testNamePattern(name) => Some(name)
    case _ => None
  }

  def archiveObjectSettings(stage: String, fileName: String) = S3ObjectSettings(
    bucket = "support-admin-console",
    key = s"$stage/archived-epic-tests/$fileName",
    publicRead = false
  )
}

class EpicTestsController(authAction: AuthAction[AnyContent], components: ControllerComponents, ws: WSClient, stage: String)(implicit ec: ExecutionContext)
  extends LockableSettingsController[EpicTests](
    authAction,
    components,
    stage,
    name = "epic-tests",
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"epic/$stage/epic-tests.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = EpicTestsController.fastlyPurger(stage, ws)
  ) with Circe {

  /**
    * Saves a single test to a new file. The file name will be the test's name.
    * Overwrites any existing archived test of the same name.
    * Removing the test from the current active tests list is done separately.
    */
  def archive = authAction.async(circe.json[EpicTest]) { request =>
    val testData = request.body
    val objectSettings = archiveObjectSettings(stage, s"${testData.name}.json")

    S3Json.createOrUpdateAsJson(objectSettings, testData)(s3Client).map {
      case Right(_) => Ok("archived")
      case Left(error) =>
        logger.error(s"Failed to archive test: $testData. Error was: $error")
        InternalServerError(error)
    }
  }

  /**
    * Fetches all archived test file keys from S3 and returns just the test names
    */
  def archivedTestNames = authAction.async { request =>
    val objectSettings = archiveObjectSettings(stage, fileName = "")

    s3Client.listKeys(objectSettings).map {
      case Right(keys) =>
        val testNames: List[String] = keys.flatMap(extractTestName)
        Ok(S3Json.noNulls(testNames.asJson))

      case Left(error) =>
        logger.error(s"Failed to fetch list of archived test names: $error")
        InternalServerError(error)
    }
  }

  /**
    * Returns the archived test data for the given name
    */
  def getArchivedTest(testName: String) = authAction.async { request =>
    val objectSettings = archiveObjectSettings(stage, s"$testName.json")

    S3Json.getFromJson[EpicTest](objectSettings)(s3Client) map {
      case Right(VersionedS3Data(test, _)) => Ok(test.asJson)
      case Left(error) =>
        logger.error(s"Failed to get archived test $testName: $error")
        InternalServerError(error)
    }
  }
}
