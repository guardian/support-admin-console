
name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.12.8"

//Bintray for simple-configuration dependency
resolvers += "Guardian Platform Bintray" at "https://dl.bintray.com/guardian/platforms"

val circeVersion = "0.10.0"
val jacksonVersion = "2.10.0"

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "com.gu.play-googleauth" %% "play-v26" % "1.0.2",
  "com.gu" %% "simple-configuration-ssm" % "1.4.1",
  "com.amazonaws" % "aws-java-sdk-s3" % "1.11.641",
  // Override jackson because the version used by AWS is always out of date and has security issues
  "com.fasterxml.jackson.core" % "jackson-databind" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-annotations" % jacksonVersion,
  "com.fasterxml.jackson.core" % "jackson-core" % jacksonVersion,
  "com.fasterxml.jackson.dataformat" % "jackson-dataformat-cbor" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jdk8" % jacksonVersion,
  "com.fasterxml.jackson.datatype" % "jackson-datatype-jsr310" % jacksonVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "com.dripower" %% "play-circe" % "2610.0",
  "com.beachape" %% "enumeratum" % "1.5.13",
  "com.beachape" %% "enumeratum-circe" % "1.5.13",
  ws,
  "dev.zio" %% "zio" % "1.0.0-RC12-1",
  "org.scalatest" %% "scalatest" % "3.0.5" % "test",
  "org.gnieh" %% "diffson-circe" % "3.1.0" % "test",
)

sources in(Compile, doc) := Seq.empty

publishArtifact in(Compile, packageDoc) := false

enablePlugins(PlayScala, RiffRaffArtifact, JDebPackaging, SystemdPlugin)

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := "support:admin-console"
riffRaffPackageName := "admin-console"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (file("cloudformation.yaml"), "cfn/cfn.yaml")
