package models

import enumeratum.{CirceEnum, Enum, EnumEntry}
import io.circe.generic.extras.Configuration
import io.circe.generic.extras.auto._
import io.circe.{Decoder, Encoder}

import scala.collection.immutable.IndexedSeq

case class HeaderContent(
  heading: String,
  subheading: String,
  primaryCta: Option[Cta],
  secondaryCta: Option[Cta],
)

case class HeaderVariant(
  name: String,
  content: HeaderContent,
  mobileContent: Option[HeaderContent],
)

case class HeaderTest(
  name: String,
  nickname: Option[String],
  isOn: Boolean,
  locations: List[Region] = Nil,
  userCohort: Option[UserCohort] = None,
  variants: List[HeaderVariant],
)

case class HeaderTests(tests: List[HeaderTest])

object HeaderTests {
  implicit val customConfig: Configuration = Configuration.default.withDefaults
  implicit val headerTestDecoder = Decoder[HeaderTest]
  implicit val headerTestEncoder = Encoder[HeaderTest]
  implicit val headerTestsDecoder = Decoder[HeaderTests]
  implicit val headerTestsEncoder = Encoder[HeaderTests]
}

    // {
    //   "name" : "USEOY_CONTRIBUTE_2021",
    //   "nickname" : "US EOY 2021 Contribute",
    //   "isOn" : true,
    //   "locations" : [
    //     "UnitedStates",
    //   ],
    //   "userCohort" : "AllNonSupporters",
    //   "variants" : [
    //     {
    //       "name" : "CONTROL",
    //       "content" : {
    //         "heading": "Support the Guardian",
    //         "subheading": "Make a year-end gift",
    //         "primaryCta": {
    //           "url": "https://support.theguardian.com/contribute",
    //           "text": "Contribute"
    //         },
    //         "secondaryCta": {
    //           "url": "https://support.theguardian.com/subscribe",
    //           "text": "Subscribe"
    //         }
    //       },
    //       "mobileContent" : {
    //         "heading": "",
    //         "subheading": "",
    //         "primaryCta": {
    //           "url": "https://support.theguardian.com/contribute",
    //           "text": "Make a year-end gift"
    //         }
    //       }
    //     }
    //   ]
    // },
