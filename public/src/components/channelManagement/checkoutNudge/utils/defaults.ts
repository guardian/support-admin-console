import { CheckoutNudgeTest, CheckoutNudgeVariant } from '../../../../models/checkoutNudge';

export const PRODUCTS = [
  { value: 'OneTimeContribution', label: 'One-Time Contribution' },
  { value: 'Contribution', label: 'Contribution' },
  { value: 'SupporterPlus', label: 'Supporter Plus' },
  { value: 'TierThree', label: 'Tier Three' },
];

export const RATE_PLANS = [
  { value: 'OneTime', label: 'One Time' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Annual', label: 'Annual' },
];

export const getDefaultVariant = (): CheckoutNudgeVariant => ({
  name: 'control',
  nudge: {
    nudgeCopy: {
      heading: '',
      body: '',
    },
    thankyouCopy: {
      heading: '',
      body: '',
    },
    nudgeToProduct: {
      product: 'Contribution',
      ratePlan: 'Monthly',
    },
  },
});

export const getDefaultTest = (): CheckoutNudgeTest => ({
  name: '',
  nickname: '',
  status: 'Draft',
  regionTargeting: {
    targetedCountryGroups: [],
  },
  nudgeFromProduct: {
    product: 'OneTimeContribution',
    ratePlan: 'OneTime',
  },
  variants: [getDefaultVariant()],
  locations: [],
  methodologies: [{ name: 'ABTest' }],
  isNew: true,
});
