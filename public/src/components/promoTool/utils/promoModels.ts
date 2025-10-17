import { CommonStringObject, Country } from '../../../utils/models';

export type PromoProduct = 'SupporterPlus' | 'TierThree' | 'DigitalPack' | 'Newspaper' | 'Weekly';

// Can't get the 'id' of a Record in this way so changed to use CommonStringObject
export const PromoProductNames: CommonStringObject = {
  SupporterPlus: 'Supporter Plus',
  TierThree: 'Tier Three',
  DigitalPack: 'Digital Pack',
  Newspaper: 'Newspaper',
  Weekly: 'Guardian Weekly',
};

export const productIds = Object.keys(PromoProductNames);

export type Product = keyof typeof PromoProductNames;

export type Products = Product;

export interface PromoCampaign {
  campaignCode: string;
  product: PromoProduct;
  name: string;
  created: string;
}

export interface AppliesTo {
  productRatePlanIds: Set<string>; // TODO: where do we get these?
  countries: Set<Country>;
}

export interface Promo {
  promoCode: string;
  name: string;
  campaignCode: string;
  appliesTo: AppliesTo;
  startTimestamp: string;
  endTimestamp: string;
  description?: string;
}

export type PromoCampaigns = PromoCampaign[];
