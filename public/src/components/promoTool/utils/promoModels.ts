import { LockStatus } from '../../channelManagement/helpers/shared';

export type PromoProduct =
  'SupporterPlus' | 'TierThree' | 'DigitalSubscription' | 'Newspaper' | 'Weekly';

export const promoProductNames: Record<PromoProduct, string> = {
  SupporterPlus: 'Supporter Plus',
  TierThree: 'Tier Three',
  DigitalSubscription: 'Digital Plus',
  Newspaper: 'Newspaper',
  Weekly: 'Guardian Weekly',
};

export function mapPromoProductToCatalogProducts(promoProduct: PromoProduct): string[] {
  const mapping: Record<PromoProduct, string[]> = {
    SupporterPlus: ['SupporterPlus'],
    TierThree: ['TierThree'],
    DigitalSubscription: ['DigitalSubscription'],
    Newspaper: ['HomeDelivery', 'NationalDelivery', 'SubscriptionCard'],
    Weekly: ['GuardianWeeklyDomestic', 'GuardianWeeklyRestOfWorld'],
  };
  return mapping[promoProduct];
}

export interface PromoCampaign {
  campaignCode: string;
  product: PromoProduct;
  name: string;
  created: string;
}

export interface AppliesTo {
  productRatePlanIds: string[];
  countries?: string[];
  countryGroups?: string[];
}

export interface CountryGroup {
  id: string;
  name: string;
  countries: string[];
}

export function getPromoCountryTargeting(
  appliesTo: AppliesTo,
  countryGroups: CountryGroup[],
): { groupIds: string[]; countries: string[] } {
  const countries = appliesTo.countries ?? [];
  const groupIds = new Set(appliesTo.countryGroups);
  for (const group of countryGroups) {
    if (group.countries.every((country) => countries.includes(country))) {
      groupIds.add(group.id);
    }
  }
  const groupedCountries = new Set(
    countryGroups.filter((group) => groupIds.has(group.id)).flatMap((group) => group.countries),
  );
  return {
    groupIds: [...groupIds],
    countries: countries.filter((country) => !groupedCountries.has(country)),
  };
}

export interface DiscountDetails {
  amount?: number;
  durationMonths?: number;
}

export interface LandingPage {
  title?: string;
  description?: string;
  roundelHtml?: string;
}

export interface Promo {
  promoCode: string;
  name: string;
  campaignCode: string;
  appliesTo: AppliesTo;
  startTimestamp: string;
  endTimestamp?: string;
  discount?: DiscountDetails;
  description?: string;
  lockStatus?: LockStatus;
  landingPage?: LandingPage;
  isIntroductoryPricing?: boolean;
}

export type PromoCampaigns = PromoCampaign[];
