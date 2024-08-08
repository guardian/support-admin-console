
name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.13.10"

val circeVersion = "0.14.1"
val awsVersion = "2.20.162"
val zioVersion = "1.0.14"

asciiGraphWidth := 999999999 // to ensure Snyk can read the the deeeeep dependency tree

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.gu.play-googleauth" %% "play-v30" % "4.0.0",
  "com.gu" %% "simple-configuration-ssm" % "1.5.7",
  "software.amazon.awssdk" % "s3" % awsVersion,
  "software.amazon.awssdk" % "dynamodb" % awsVersion,
  "software.amazon.awssdk" % "athena" % awsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "com.dripower" %% "play-circe" % "3014.1",
  "com.beachape" %% "enumeratum" % "1.7.0",
  "com.beachape" %% "enumeratum-circe" % "1.7.0",
  ws,
  "dev.zio" %% "zio" % zioVersion,
  "dev.zio" %% "zio-streams" % zioVersion,
  "org.scalatest" %% "scalatest" % "3.2.10" % "test",
  "org.gnieh" %% "diffson-circe" % "4.1.1" % "test",
)

dependencyOverrides ++= List(
  "com.fasterxml.jackson.core" % "jackson-core" % "2.17.2",
  // The version of netty-handler currently used by athena has a vulnerability - https://security.snyk.io/vuln/SNYK-JAVA-IONETTY-5725787
  "io.netty" % "netty-handler" % "4.1.100.Final",
  "io.netty" % "netty-codec-http2" % "4.1.100.Final"
)

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
