package models

case class CountdownTheme(
  backgroundColor: String,
  foregroundColor: String,
)

case class CountdownSettings(
                              overwriteHeadingLabel: String,
                              countdownStartTimestamp: String,
                              countdownDeadlineTimestamp: String,
                              useLocalTime: Boolean,
                              theme: CountdownTheme,
)
