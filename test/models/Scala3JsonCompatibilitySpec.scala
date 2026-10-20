package models

import io.circe.syntax.*
import io.circe.parser.parse
import models.Channel.Inline1
import models.Status.Live
import models.promos.ProductCatalog.{BillingPeriod, GuardianWeeklyRatePlans, Pricing, ProductDetails, RatePlan}
import org.scalatest.EitherValues
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers

class Scala3JsonCompatibilitySpec extends AnyFlatSpec with Matchers with EitherValues {
  "configured banner visual codecs" should "preserve the kind discriminator and image fields" in {
    val expected = parse(
      """{"kind":"Image","mobileUrl":"mobile","tabletUrl":"tablet","desktopUrl":"desktop","altText":"alt"}"""
    ).value

    val visual = expected.as[BannerDesignVisual].value

    visual.asJson shouldBe expected
  }

  "banner design codecs" should "round-trip nested colours and enum values" in {
    val colour = HexColour("1", "2", "3", "rgb")
    val cta = CtaDesign(CtaStateDesign(colour, colour, None))
    val colours = BannerDesignColours(
      basic = BannerDesignBasicColours(colour, colour, colour, colour, colour),
      highlightedText = BannerDesignHighlightedTextColours(colour, colour),
      primaryCta = cta,
      secondaryCta = cta,
      closeButton = cta,
      ticker = TickerDesign(colour, colour, Some(colour), Some(colour), Some(colour))
    )
    val design = BannerDesign(
      name = "sample",
      style = None,
      colourTheme = None,
      status = BannerDesignStatus.Live,
      visual = None,
      headerImage = None,
      colours = colours,
      lockStatus = None,
      fonts = None
    )

    val encoded = design.asJson

    encoded.as[BannerDesign].value shouldBe design
    encoded.hcursor.get[String]("status").value shouldBe "Live"
  }

  "configured choice card codecs" should "preserve product discriminators and enum values" in {
    val expected = parse(
      """{"choiceCards":[{"product":{"supportTier":"Contribution","ratePlan":"Monthly"},"label":"Monthly support","benefitsLabel":null,"benefits":[],"pill":null,"isDefault":true,"destination":"LandingPage","destinationTest":null}]}"""
    ).value

    val settings = expected.as[ChoiceCardsSettings].value

    settings.asJson shouldBe expected
  }

  "choice card rate plan codecs" should "round-trip Monthly and Annual using their existing JSON values" in {
    val monthly: ChoiceCardsSettings.RatePlan = ChoiceCardsSettings.RatePlan.Monthly
    val annual: ChoiceCardsSettings.RatePlan = ChoiceCardsSettings.RatePlan.Annual

    monthly.asJson.noSpaces.shouldBe("\"Monthly\"")
    annual.asJson.noSpaces.shouldBe("\"Annual\"")
    parse(monthly.asJson.noSpaces).value.as[ChoiceCardsSettings.RatePlan].value.shouldBe(monthly)
    parse(annual.asJson.noSpaces).value.as[ChoiceCardsSettings.RatePlan].value.shouldBe(annual)
  }

  "support landing page codecs" should "retain defaults for omitted optional product fields" in {
    val expected = parse(
      """{"Contribution":{"title":"One-off","benefits":[],"cta":{"copy":"Contribute"}},"SupporterPlus":{"title":"All-access","benefits":[],"cta":{"copy":"Subscribe"}}}"""
    ).value

    val products = expected.as[Products].value

    products.DigitalSubscription shouldBe None
    products.Contribution.titlePill shouldBe None
    products.SupporterPlus.billingPeriodsCopy shouldBe None
  }

  "ticker settings codecs" should "apply the default goal copy when decoding older channel tests" in {
    val expected = parse(
      """{"name":"CONTROL","heading":null,"paragraphs":[],"tickerSettings":{"currencySymbol":"£","copy":{"countLabel":"supporters"},"name":"global"},"cta":null,"secondaryCta":null,"separateArticleCount":null,"showChoiceCards":null,"choiceCardsSettings":null,"bylineWithImage":null,"defaultChoiceCardFrequency":null,"showSignInLink":null,"newsletterSignup":null}"""
    ).value

    val variant = expected.as[EpicVariant].value

    variant.tickerSettings.map(_.copy.goalCopy) shouldBe Some("goal")
    variant.asJson.hcursor
      .downField("tickerSettings")
      .downField("copy")
      .get[String]("goalCopy")
      .value shouldBe "goal"
  }

  "product catalog codecs" should "retain currency defaults and billing period enum values" in {
    val pricing = parse("""{"GBP":12}""").value.as[Pricing].value
    val billingPeriod = parse(""""Month"""").value.as[BillingPeriod].value
    val ratePlan = parse("""{"billingPeriod":"Month","id":"monthly","pricing":{"GBP":12}}""").value
      .as[RatePlan]
      .value
    val month: BillingPeriod = BillingPeriod.Month

    pricing shouldBe Pricing(GBP = Some(12.0))
    billingPeriod shouldBe BillingPeriod.Month
    ratePlan shouldBe RatePlan(BillingPeriod.Month, "monthly", pricing)
    month.asJson.noSpaces.shouldBe("\"Month\"")
  }

  "product details codecs" should "retain the customer name and rate plan fields" in {
    val ratePlan = RatePlan(BillingPeriod.Month, "monthly", Pricing(GBP = Some(12.0)))
    val weeklyRatePlans = GuardianWeeklyRatePlans(
      Annual = None,
      AnnualPlus = None,
      Monthly = Some(ratePlan),
      MonthlyPlus = None,
      Quarterly = None,
      QuarterlyPlus = None,
      OneYearGift = None,
      ThreeMonthGift = None
    )
    val details = new ProductDetails[GuardianWeeklyRatePlans] {
      override val customerFacingName: String = "Weekly support"
      override val ratePlans: GuardianWeeklyRatePlans = weeklyRatePlans
    }

    val encoded = details.asJson
    val decoded = encoded.as[ProductDetails[GuardianWeeklyRatePlans]].value

    decoded.customerFacingName shouldBe "Weekly support"
    decoded.ratePlans shouldBe weeklyRatePlans
  }

  "inline1 codecs" should "round trip" in {
    val test = Inline1Test(
      name = "test1",
      nickname = Some("test1"),
      channel = Some(Inline1),
      status = Some(Live),
      priority = Some(1),
      lockStatus = Some(LockStatus(locked = false, email = None, timestamp = None)),
      variants = List(
        Inline1Variant(
          name = "control",
          message = Inline1SupportMessage(
            heading = "heading",
            body = "body",
            primaryCta = Cta(
              text = "Support us",
              baseUrl = "https://support.theguardian.com"
            ),
            image = Some(
              ResponsiveImage(
                mobileUrl =
                  "https://i.guim.co.uk/img/media/630a3735c02e195be89ab06fd1b8192959e282ab/0_0_1172_560/500.png?width=500&quality=75&s=937595b3f471d6591475955335c7c023",
                tabletUrl =
                  "https://i.guim.co.uk/img/media/630a3735c02e195be89ab06fd1b8192959e282ab/0_0_1172_560/500.png?width=500&quality=75&s=937595b3f471d6591475955335c7c023",
                desktopUrl =
                  "https://i.guim.co.uk/img/media/630a3735c02e195be89ab06fd1b8192959e282ab/0_0_1172_560/500.png?width=500&quality=75&s=937595b3f471d6591475955335c7c023",
                altText = "altText"
              )
            )
          )
        )
      )
    )

    val encoded = test.asJson
    val decoded = encoded.as[Inline1Test].value
    decoded shouldEqual test
  }
}
