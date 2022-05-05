package controllers

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController.LockableS3ObjectResponse
import models.{Draft, HeaderTest, HeaderTests, Live, LockStatus}
import play.api.libs.circe.Circe
import play.api.libs.ws.WSClient
import play.api.mvc.{AnyContent, ControllerComponents}
import services.{Dynamo, DynamoChannelTests, FastlyPurger, S3Json, VersionedS3Data}
import services.S3Client.S3ObjectSettings
import zio.DefaultRuntime
import io.circe.generic.auto._
import utils.Circe.noNulls

import scala.concurrent.ExecutionContext

object HeaderTestsController {
  val name = "header-tests"
}

class HeaderTestsController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  ws: WSClient,
  stage: String,
  runtime: DefaultRuntime
)(implicit ec: ExecutionContext) extends LockableS3ObjectController[HeaderTests](
    authAction,
    components,
    stage,
    name = HeaderTestsController.name,
    dataObjectSettings = S3ObjectSettings(
      bucket = "gu-contributions-public",
      key = s"header/$stage/${HeaderTestsController.name}.json",
      publicRead = true,  // This data will be requested by dotcom
      cacheControl = Some("max-age=30"),
      surrogateControl = Some("max-age=86400")  // Cache for a day, and use cache purging after updates
    ),
    fastlyPurger = FastlyPurger.fastlyPurger(stage, s"${HeaderTestsController.name}.json", ws),
    runtime = runtime
  ) with Circe {

  override def get = authAction { request =>
    import io.circe.syntax._
    import io.circe.generic.auto._

    val statuses = request.queryString.get("status")
      .map(statuses => statuses.toList.flatMap(models.Status.fromString))
      .getOrElse(List(Live, Draft))

    val tests = DynamoChannelTests.getAllTests[HeaderTest]("header-tests-CODE", statuses)
      .map(result => {
        println(result)
        result
      })

    val response = LockableS3ObjectResponse(HeaderTests(tests), "0", LockStatus(true, Some(request.user.email), None), request.user.email)
    Ok(noNulls(response.asJson))
  }

  import io.circe.generic.auto._
  override def set = authAction(circe.json[VersionedS3Data[HeaderTests]]) { request =>
    request.body.value.tests.foreach(test => DynamoChannelTests.createOrUpdateTest[HeaderTest]("header-tests-CODE", test))
    Ok("done")
  }
}
