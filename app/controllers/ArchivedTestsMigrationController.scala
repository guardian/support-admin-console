package controllers

import com.gu.googleauth.AuthAction
import com.typesafe.scalalogging.LazyLogging
import io.circe.Json
import play.api.mvc.{AbstractController, Action, AnyContent, ControllerComponents}
import services.{DynamoArchivedChannelTests, DynamoChannelTests}
import zio.{IO, ZEnv}
import io.circe.generic.auto._
import models.Channel
import models.Channel._
import software.amazon.awssdk.services.dynamodb.model.{PutRequest, WriteRequest}

import scala.concurrent.{ExecutionContext, Future}
import scala.jdk.CollectionConverters.CollectionHasAsScala

class ArchivedTestsMigrationController(
  authAction: AuthAction[AnyContent],
  components: ControllerComponents,
  stage: String,
  runtime: zio.Runtime[ZEnv],
  dynamoChannelTests: DynamoChannelTests,
  dynamoArchivedChannelTests: DynamoArchivedChannelTests
)(implicit ec: ExecutionContext) extends AbstractController(components) with LazyLogging {

  private def run(channel: Channel) = runtime.unsafeRunToFuture {
    dynamoChannelTests
      .getAllArchived(channel)
      .flatMap(tests => {
        val writeRequests = tests.asScala.toList.map(test => WriteRequest.builder.putRequest(
          PutRequest
            .builder
            .item(test)
            .build()
        ).build())

        dynamoArchivedChannelTests
          .putAllBatched(writeRequests)
          .map(_ => writeRequests.length)
      })
      .map(count => Ok(s"Migrated $count items for channel $channel"))
      .catchAll(error => {
        logger.error(s"Returning InternalServerError to client: ${error.getMessage}", error)
        IO.succeed(InternalServerError(error.getMessage))
      })
  }

  def migrate(channel: String): Action[AnyContent] = authAction.async { request =>
    Json.fromString(channel).as[Channel] match {
      case Right(channel) => run(channel)
      case Left(error) => Future.successful(BadRequest(error.getMessage))
    }
  }
}
