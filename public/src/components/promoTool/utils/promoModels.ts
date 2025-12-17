import { LockStatus } from '../../channelManagement/helpers/shared';

export type PromoProduct =
  | 'SupporterPlus'
  | 'TierThree'
  | 'DigitalSubscription'
  | 'Newspaper'
  | 'Weekly';

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
  countryGroups: string[];
}

export interface CountryGroup {
  id: string;
  name: string;
  countries: string[];
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
}

export type PromoCampaigns = PromoCampaign[];
