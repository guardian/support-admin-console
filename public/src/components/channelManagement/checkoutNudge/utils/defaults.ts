import {
  CheckoutNudgeTest,
  CheckoutNudgeVariant,
  ProductType,
} from '../../../../models/checkoutNudge';

export const PRODUCTS = [
  { value: 'OneTimeContribution', label: 'One-Time Contribution' },
  { value: 'Contribution', label: 'Contribution' },
  { value: 'SupporterPlus', label: 'Supporter Plus' },
  { value: 'DigitalSubscription', label: 'Digital Plus' },
];

export const ONE_TIME_PLANS = [{ value: 'OneTime', label: 'One Time' }] as const;
export const RECURRING_PLANS = [
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Annual', label: 'Annual' },
] as const;
export const RATE_PLANS = [...ONE_TIME_PLANS, ...RECURRING_PLANS] as const;

export const getAvailableRatePlans = (
  product: ProductType,
): typeof ONE_TIME_PLANS | typeof RECURRING_PLANS => {
  if (product === 'OneTimeContribution') {
    return ONE_TIME_PLANS;
  }

  return RECURRING_PLANS;
};

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
