import { SingleCheckoutTest, SingleCheckoutVariant } from '../../../../models/singleCheckout';

export const getDefaultVariant = (): SingleCheckoutVariant => ({
  name: 'control',
  heading: '',
  subheading: '',
  amounts: {
    defaultContributionType: 'MONTHLY',
    displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
    amountsCardData: {
      ONE_OFF: {
        amounts: [1],
        defaultAmount: 1,
        hideChooseYourAmount: false,
      },
      MONTHLY: {
        amounts: [10],
        defaultAmount: 10,
        hideChooseYourAmount: false,
      },
      ANNUAL: {
        amounts: [100],
        defaultAmount: 100,
        hideChooseYourAmount: false,
      },
    },
  },
});

export const getDefaultTest = (): SingleCheckoutTest => ({
  name: '',
  nickname: '',
  status: 'Draft',
  regionTargeting: {
    targetedCountryGroups: [],
  },
  variants: [getDefaultVariant()],
  locations: [],
  methodologies: [{ name: 'ABTest' }],
  isNew: true,
});
