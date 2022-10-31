
name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.13.10"

val circeVersion = "0.14.1"
val awsVersion = "2.17.238"
val zioVersion = "1.0.14"
val jacksonVersion = "2.13.4"

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.gu.play-googleauth" %% "play-v28" % "2.2.6",
  "com.gu" %% "simple-configuration-ssm" % "1.5.7",
  "software.amazon.awssdk" % "s3" % awsVersion,
  "software.amazon.awssdk" % "dynamodb" % awsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "com.dripower" %% "play-circe" % "2814.2",
  "com.beachape" %% "enumeratum" % "1.7.0",
  "com.beachape" %% "enumeratum-circe" % "1.7.0",
  ws,
  "dev.zio" %% "zio" % zioVersion,
  "dev.zio" %% "zio-streams" % zioVersion,
  // Use the latest version of jackson
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
  "com.fasterxml.jackson.module" %% "jackson-module-scala" % jacksonVersion,
  "org.scalatest" %% "scalatest" % "3.2.10" % "test",
  "org.gnieh" %% "diffson-circe" % "4.1.1" % "test",
)

dependencyOverrides += "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion

dynamoDBLocalPort := 8083
startDynamoDBLocal := {startDynamoDBLocal.dependsOn(Test / compile).value}
Test / testQuick := {(Test / testQuick).dependsOn(startDynamoDBLocal).evaluated}
Test / test := {(Test / test).dependsOn(startDynamoDBLocal).value}
Test / testOptions += {dynamoDBLocalTestCleanup.value}

sources in(Compile, doc) := Seq.empty

publishArtifact in(Compile, packageDoc) := false

enablePlugins(PlayScala, RiffRaffArtifact, SbtWeb, JDebPackaging, SystemdPlugin)

pipelineStages := Seq(digest)

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := "support:admin-console"
riffRaffPackageName := "admin-console"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("cdk/cdk.out/AdminConsole-PROD.template.json"), "cfn/AdminConsole-PROD.template.json")
riffRaffArtifactResources += (file("cdk/cdk.out/AdminConsole-CODE.template.json"), "cfn/AdminConsole-CODE.template.json")

javaOptions in run ++= Seq("-Xms2G", "-Xmx2G", "-Xss4M")
