
name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.13.7"

val circeVersion = "0.14.1"

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.4",
  "com.gu.play-googleauth" %% "play-v28" % "2.2.2",
  "com.gu" %% "simple-configuration-ssm" % "1.5.7",
  "software.amazon.awssdk" % "s3" % "2.17.99",
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic-extras" % circeVersion,
  "com.dripower" %% "play-circe" % "2814.1",
  "com.beachape" %% "enumeratum" % "1.7.0",
  "com.beachape" %% "enumeratum-circe" % "1.7.0",
  ws,
  "dev.zio" %% "zio" % "1.0.14",
  "org.scalatest" %% "scalatest" % "3.2.10" % "test",
  "org.gnieh" %% "diffson-circe" % "4.1.1" % "test",
)

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
