package services
import cats.syntax.either._
import software.amazon.awssdk.auth.credentials
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.auth.credentials.AwsCredentialsProviderChain
import software.amazon.awssdk.services.ssm.SsmClient
import software.amazon.awssdk.services.ssm.model.GetParameterRequest

import scala.util.Try

object SSMService {

  val region = Region.EU_WEST_1
  val ProfileName = "membership"

  lazy val CredentialsProvider: AwsCredentialsProviderChain =
    credentials.AwsCredentialsProviderChain
      .builder()
      .credentialsProviders(
        credentials.ProfileCredentialsProvider.create(ProfileName),
        credentials.InstanceProfileCredentialsProvider.builder().asyncCredentialUpdateEnabled(false).build(),
        credentials.EnvironmentVariableCredentialsProvider.create(),
        credentials.ContainerCredentialsProvider.builder().build(), // for use with lambda snapstart
        )
      .build()

  val client = SsmClient.builder()
    .region(Region.EU_WEST_1)
    .credentialsProvider(CredentialsProvider)
    .build();

   def getParameter(parameterName: String): Either[String, String] = {
     Console.println("Getting parameter: " + parameterName)
    val request = GetParameterRequest.builder()
      .name(parameterName)
      .withDecryption(true)
      .build()
     Try(client.getParameter(request)).toEither
       .leftMap(error => error.getMessage)
       .map(result => result.parameter().value())

  }

}
