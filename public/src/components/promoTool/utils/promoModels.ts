import { LockStatus } from '../../channelManagement/helpers/shared';

export type PromoProduct = 'SupporterPlus' | 'TierThree' | 'DigitalPack' | 'Newspaper' | 'Weekly';

export const promoProductNames: Record<PromoProduct, string> = {
  SupporterPlus: 'Supporter Plus',
  TierThree: 'Tier Three',
  DigitalPack: 'Digital Pack',
  Newspaper: 'Newspaper',
  Weekly: 'Guardian Weekly',
};

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
  name: string;
  id: string;
  defaultCountry?: string;
  countries: string[];
  currency: string;
  postalCode: string;
}

export interface DiscountDetails {
  amount?: number;
  durationMonths?: number;
}

export interface Promo {
  promoCode: string;
  name: string;
  campaignCode: string;
  appliesTo: AppliesTo;
  startTimestamp: string;
  endTimestamp: string;
  discount?: DiscountDetails;
  description?: string;
  lockStatus?: LockStatus;
}

export type PromoCampaigns = PromoCampaign[];
