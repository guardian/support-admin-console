import { OneTimeCheckoutTest, OneTimeCheckoutVariant } from '../../../../models/oneTimeCheckout';

export const getDefaultVariant = (): OneTimeCheckoutVariant => ({
  name: 'control',
  heading: '',
  subheading: '',
  amounts: {
    amounts: [1],
    defaultAmount: 1,
    hideChooseYourAmount: false,
  },
});

export const getDefaultTest = (): OneTimeCheckoutTest => ({
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
