package controllers

import com.gu.googleauth.AuthAction
import controllers.LockableS3ObjectController.LockableS3ObjectResponse
import io.circe.{Decoder, Encoder}
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, AnyContent, ControllerComponents}
import services.{Dynamo, DynamoChannelTests, S3Json, VersionedS3Data}
import io.circe.syntax._
import io.circe.generic.auto._
import models.{HeaderTest, HeaderTests, LockStatus}
import utils.Circe.noNulls

import scala.concurrent.ExecutionContext

class DynamoTestsController[T : Decoder : Encoder](
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  name: String
)(implicit ec: ExecutionContext) extends AbstractController(components) with Circe {

  private val tableName = s"$name-$stage"

//  def getAll = authAction { request =>
//    import io.circe.syntax._
//    import io.circe.generic.auto._
//    val tests = DynamoChannelTests.getAllTests()[HeaderTest](tableName, Nil)
//      .map(result => {
//        println(result)
//        result
//      })
//      .collect { case Right(test) => test }
//
//    val response = LockableS3ObjectResponse(HeaderTests(tests), "0", LockStatus(true, Some(request.user.email), None), request.user.email)
//    Ok(noNulls(response.asJson))
//  }
//
//  import io.circe.generic.auto._
//  def set = authAction(circe.json[VersionedS3Data[HeaderTests]]) { request =>
//    request.body.value.tests.foreach(test => DynamoChannelTests.createOrUpdateTest[HeaderTest](tableName, test))
//    Ok("done")
//  }
}
