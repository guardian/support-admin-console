package utils

import io.circe.Decoder

object Circe {
  def decodeStringAndCollect[T](pf: PartialFunction[String,T]): Decoder[T] = Decoder.decodeString.emap { s =>
    pf.lift(s)
      .map(Right.apply)
      .getOrElse(Left(s"Unexpected value: $s"))
  }
}
