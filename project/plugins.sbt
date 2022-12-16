addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.18")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.1.0")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.3")

addSbtPlugin("com.localytics" % "sbt-dynamodb" % "2.0.2")

libraryDependencies += "org.vafer" % "jdeb" % "1.5" artifacts (Artifact("jdeb", "jar", "jar"))
