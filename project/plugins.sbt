addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.13")

addSbtPlugin("com.gu" % "sbt-riffraff-artifact" % "1.1.18")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "1.1.0")

libraryDependencies += "org.vafer" % "jdeb" % "1.5" artifacts (Artifact("jdeb", "jar", "jar"))
