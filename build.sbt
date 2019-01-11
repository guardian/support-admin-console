
name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.12.8"

//Bintray for simple-configuration dependency
resolvers += "Guardian Platform Bintray" at "https://dl.bintray.com/guardian/platforms"

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.7.2",
  "com.gu" %% "play-googleauth" % "0.7.7",
  "com.gu" %% "simple-configuration-ssm" % "1.4.1",
  "com.amazonaws" % "aws-java-sdk-s3" % "1.11.480",
  ws
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
