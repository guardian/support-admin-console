import { OneTimeCheckoutTest } from '../../../../models/oneTimeCheckout';
import { findMParticleTemplates } from './findMParticleTemplates';

const baseTest: OneTimeCheckoutTest = {
  name: 'test',
  status: 'Live',
  regionTargeting: { targetedCountryGroups: [] },
  variants: [],
  methodologies: [],
  locations: [],
};

describe('findMParticleTemplates', () => {
  it('returns an empty array when there are no variants', () => {
    expect(findMParticleTemplates({ ...baseTest, variants: [] })).toEqual([]);
  });

  it('finds a template in a variant heading', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: '%%mParticle_last_single_contribution_amount%%',
          subheading: '',
          amounts: { amounts: [1], defaultAmount: 1, hideChooseYourAmount: false },
        },
      ],
    });
    expect(result).toEqual(['last_single_contribution_amount']);
  });

  it('finds templates across heading and subheading and deduplicates', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: '%%mParticle_last_single_contribution_amount%%',
          subheading: 'Welcome %%mParticle_city%% — %%mParticle_city%%',
          amounts: { amounts: [1], defaultAmount: 1, hideChooseYourAmount: false },
        },
      ],
    });
    expect(result).toEqual(['last_single_contribution_amount', 'city']);
  });

  it('finds a template from the amount attribute configuration', () => {
    const result = findMParticleTemplates({
      ...baseTest,
      variants: [
        {
          name: 'control',
          heading: 'Hello',
          subheading: 'Welcome',
          amounts: {
            amounts: [1],
            defaultAmount: 1,
            hideChooseYourAmount: false,
            mParticleAmountAttribute: 'last_single_contribution_amount',
          },
        },
      ],
    });
    expect(result).toEqual(['last_single_contribution_amount']);
  });
});
