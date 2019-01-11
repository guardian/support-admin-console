package services

import com.amazonaws.services.s3.{AmazonS3, AmazonS3ClientBuilder}
import com.typesafe.scalalogging.StrictLogging

import scala.concurrent.{ExecutionContext, Future}
import scala.util.control.NonFatal

object S3 extends StrictLogging {
  private val s3Client: AmazonS3 = AmazonS3ClientBuilder
    .standard()
    .withRegion(Aws.region)
    .withCredentials(Aws.credentialsProvider)
    .build()

  def get(bucket: String, key: String)(implicit ec: ExecutionContext): Future[String] = Future {
    val stream = s3Client.getObject(bucket, key).getObjectContent

    val result = scala.io.Source.fromInputStream(stream).mkString

    stream.close()

    result
  }

  def put(bucket: String, key: String, value: String)(implicit ec: ExecutionContext): Future[Either[String,Unit]] = Future {
    try {
      s3Client.putObject(bucket, key, value)
      Right[String,Unit]{ () }
    } catch {
      case NonFatal(e) =>
        logger.error(s"Error writing $bucket/$key to S3: ${e.getMessage}", e)
        Left(s"Error writing to S3: ${e.getMessage}")
    }
  }
}
