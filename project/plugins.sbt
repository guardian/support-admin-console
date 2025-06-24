addSbtPlugin("org.playframework" % "sbt-plugin" % "3.0.7")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "2.3.1")

addSbtPlugin("com.typesafe.sbt" % "sbt-digest" % "1.1.4")

addSbtPlugin("com.localytics" % "sbt-dynamodb" % "2.0.3")

addSbtPlugin("com.eed3si9n" % "sbt-buildinfo" % "0.13.1")

libraryDependencies += "org.vafer" % "jdeb" % "1.14" artifacts (Artifact("jdeb", "jar", "jar"))
