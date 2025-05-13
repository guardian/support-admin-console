package models

case class CountdownTheme(
  backgroundColor: String,
  foregroundColor: String,
)

case class CountdownSettings(
  label: String,
  countdownStartInMillis: String,
  countdownDeadlineInMillis: String,
  theme: CountdownTheme,
)
