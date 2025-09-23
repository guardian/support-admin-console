export type PromoProduct =
  | 'Supporter Plus'
  | 'Three Tier'
  | 'Digital Pack'
  | 'Newspaper'
  | 'Guardian Weekly'; // PromoProduct?

export const productTypes = [
  'Supporter Plus',
  'Three Tier',
  'Digital Pack',
  'Newspaper',
  'Guardian Weekly', // TODO: notice the scala PromoProduct model for this is 'Weekly'
];

export interface PromoCampaign {
  campaignCode: string;
  product: PromoProduct;
  name: string;
  created: string;
}

export type PromoCampaigns = PromoCampaign[];

/* TODO: replace these dummy variables when we have data/endpoints to call */
export const dummySelectedCampaign: PromoCampaign = {
  campaignCode: '1234567',
  product: 'Three Tier',
  name: 'US Thanksgiving 2025 30% off',
  created: '2025-09-20',
};
export const dummySelectedCampaign2: PromoCampaign = {
  campaignCode: '1234567',
  product: 'Three Tier',
  name: 'US New Year 2025 50% off',
  created: '2025-08-20',
};
export const dummyCampaigns: PromoCampaigns = [dummySelectedCampaign, dummySelectedCampaign2];
export const dummyCreatePromoCampaignFunction = (campaign: PromoCampaign): void => {
  console.log('dummy creation function happening for ' + campaign);
};
export const dummySelectedPromoCampaignFunction = (campaignName: string): void => {
  console.log('dummy selected function happening for ' + campaignName);
};
/* end dummy data */
