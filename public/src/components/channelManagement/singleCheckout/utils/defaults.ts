import { SingleCheckoutTest, SingleCheckoutVariant } from '../../../../models/singleCheckout';

export const getDefaultVariant = (): SingleCheckoutVariant => ({
  name: 'control',
  heading: '',
  subheading: '',
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
