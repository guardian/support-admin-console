package models

case class CountDownTheme(
  backgroundColor: String,
  foregroundColor: String,
)

case class CountDownSettings(
  label: String,
  countdownStartInMillis: String,
  countdownDeadlineInMillis: String,
  theme: CountDownTheme,
)
