package models.promos

case class PromoCampaign(
  campaignCode: String,
  product: PromoProduct,
  name: String,
  created: String
)
