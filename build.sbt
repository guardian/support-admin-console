name := "support-admin-console"

version := "1.0-SNAPSHOT"

scalaVersion := "2.13.16"

val circeVersion = "0.14.14"
val awsVersion = "2.31.60"
val zioVersion = "2.1.19"

lazy val scalafmtSettings = Seq(
  scalafmtFilter.withRank(KeyRanks.Invisible) := "diff-dirty",
  (Test / test) := ((Test / test) dependsOn (Test / scalafmtCheckAll)).value,
  (Test / testOnly) := ((Test / testOnly) dependsOn (Test / scalafmtCheckAll)).evaluated,
  (Test / testQuick) := ((Test / testQuick) dependsOn (Test / scalafmtCheckAll)).evaluated
)

lazy val root = (project in file("."))
  .enablePlugins(PlayScala, RiffRaffArtifact, SbtWeb, JDebPackaging, SystemdPlugin, BuildInfoPlugin)
  .settings(
    buildInfoKeys := BuildInfoSettings.buildInfoKeys,
    buildInfoPackage := "app",
    scalafmtSettings
  )

asciiGraphWidth := 999999999 // to ensure Snyk can read the the deeeeep dependency tree

libraryDependencies ++= Seq(
  "com.typesafe.scala-logging" %% "scala-logging" % "3.9.5",
  "com.gu.play-googleauth" %% "play-v30" % "24.1.1",
  "com.google.cloud" % "google-cloud-bigquery" % "2.52.0",
  "com.gu" %% "simple-configuration-ssm" % "5.1.2",
  "software.amazon.awssdk" % "s3" % awsVersion,
  "software.amazon.awssdk" % "dynamodb" % awsVersion,
  "io.circe" %% "circe-core" % circeVersion,
  "io.circe" %% "circe-generic" % circeVersion,
  "io.circe" %% "circe-parser" % circeVersion,
  "io.circe" %% "circe-generic-extras" % "0.14.4",
  "com.dripower" %% "play-circe" % "3014.1",
  "com.beachape" %% "enumeratum" % "1.9.0",
  "com.beachape" %% "enumeratum-circe" % "1.9.0",
  ws,
  "dev.zio" %% "zio" % zioVersion,
  "dev.zio" %% "zio-streams" % zioVersion,
  "org.scalatest" %% "scalatest" % "3.2.19" % "test",
  "org.gnieh" %% "diffson-circe" % "4.6.0" % "test"
)

dependencyOverrides ++= List(
  // Play still uses an old version of jackson-core which has a vulnerability - https://security.snyk.io/vuln/SNYK-JAVA-COMFASTERXMLJACKSONCORE-7569538
  "com.fasterxml.jackson.core" % "jackson-core" % "2.19.1",
  "com.fasterxml.jackson.core" % "jackson-databind" % "2.19.1",
  "io.netty" % "netty-handler" % "4.2.2.Final",
  "io.netty" % "netty-codec-http2" % "4.2.2.Final",
  // Related to Play 3.0.2-6 currently brings in a vulnerable version of commons-io
  "commons-io" % "commons-io" % "2.19.0" % Test,
  "commons-beanutils" % "commons-beanutils" % "1.11.0"
)

excludeDependencies ++= Seq(
  // Exclude htmlunit due to a vulnerability. Brought in via scalatest but we don't need it.
  // The vulnerability is fixed in htmlunit v3 onwards, but the lib was renamed so we cannot force a newer version
  // by specifying it in the dependencies.
  ExclusionRule("net.sourceforge.htmlunit", "htmlunit")
)

dynamoDBLocalPort := 8083
startDynamoDBLocal := { startDynamoDBLocal.dependsOn(Test / compile).value }
Test / testQuick := { (Test / testQuick).dependsOn(startDynamoDBLocal).evaluated }
Test / test := { (Test / test).dependsOn(startDynamoDBLocal).value }
Test / testOptions += { dynamoDBLocalTestCleanup.value }

sources in (Compile, doc) := Seq.empty

publishArtifact in (Compile, packageDoc) := false

pipelineStages := Seq(digest)

riffRaffPackageType := (packageBin in Debian).value
riffRaffManifestProjectName := "support:admin-console"
riffRaffPackageName := "admin-console"
riffRaffUploadArtifactBucket := Option("riffraff-artifact")
riffRaffUploadManifestBucket := Option("riffraff-builds")
riffRaffArtifactResources += (
  file("cdk/cdk.out/AdminConsole-PROD.template.json"),
  "cfn/AdminConsole-PROD.template.json"
)
riffRaffArtifactResources += (
  file("cdk/cdk.out/AdminConsole-CODE.template.json"),
  "cfn/AdminConsole-CODE.template.json"
)

javaOptions in run ++= Seq("-Xms2G", "-Xmx2G", "-Xss4M")
