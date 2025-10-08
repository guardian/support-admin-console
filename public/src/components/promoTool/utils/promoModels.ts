import { Country } from '../../../utils/models';

export type PromoProduct = 'SupporterPlus' | 'TierThree' | 'DigitalPack' | 'Newspaper' | 'Weekly';

// This does not work in the context of a select 
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

/* TODO: replace these dummy variables when we have data/endpoints to call */
export const dummySelectedCampaign: PromoCampaign = {
  campaignCode: 'C1234567',
  product: 'TierThree',
  name: 'US Thanksgiving 2025 30% off',
  created: '2025-09-20',
};
export const dummySelectedCampaign2: PromoCampaign = {
  campaignCode: 'C345678',
  product: 'TierThree',
  name: 'US New Year 2025 50% off',
  created: '2025-08-20',
};
export const dummyPromo1: Promo = {
  promoCode: 'C1234567',
  name: '',
  campaignCode: 'P123456',
  appliesTo: {
    productRatePlanIds: new Set<string>(['monthly', 'annual']),
    countries: new Set<Country>(['US', 'AU']),
  },
  startTimestamp: '2025-08-20',
  endTimestamp: '2025-12-20',
  description: 'My description here',
};
export const dummyCampaigns: PromoCampaigns = [dummySelectedCampaign, dummySelectedCampaign2];
export const dummyPromos: Promo[] = [dummyPromo1];
export const dummyCreatePromoCampaignFunction = (campaign: PromoCampaign): void => {
  console.log('dummy creation function happening for ' + campaign);
};
export const dummySelectedPromoCampaignFunction = (campaignName: string): void => {
  console.log('dummy selected function happening for ' + campaignName);
};
/* end dummy data */
