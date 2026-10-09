package services

import software.amazon.awssdk.auth.credentials.{
  AwsCredentialsProviderChain,
  InstanceProfileCredentialsProvider,
  ProfileCredentialsProvider
}
import software.amazon.awssdk.regions.Region

object Aws {
  private val credentialsProfile = sys.env.getOrElse("AWS_PROFILE", "membership")

  val credentialsProvider = AwsCredentialsProviderChain
    .builder()
    .credentialsProviders(
      ProfileCredentialsProvider.builder().profileName(credentialsProfile).build(),
      InstanceProfileCredentialsProvider.builder().asyncCredentialUpdateEnabled(true).build()
    )
    .build()

  val region = Region.EU_WEST_1
}
