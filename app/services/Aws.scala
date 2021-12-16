package services

import software.amazon.awssdk.auth.credentials.{AwsCredentialsProviderChain, InstanceProfileCredentialsProvider, ProfileCredentialsProvider}
import software.amazon.awssdk.regions.Region


object Aws {
  val credentialsProvider = AwsCredentialsProviderChain.builder().credentialsProviders(
    ProfileCredentialsProvider.builder.profileName("membership").build,
    InstanceProfileCredentialsProvider.builder.asyncCredentialUpdateEnabled(false).build
  )

  val region = Region.EU_WEST_1
}
