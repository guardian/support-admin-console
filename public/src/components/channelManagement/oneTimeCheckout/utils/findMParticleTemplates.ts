import { OneTimeCheckoutTest } from '../../../../models/oneTimeCheckout';
import { addMParticleTemplates } from '../../helpers/addMParticleTemplates';

export const findMParticleTemplates = (test: OneTimeCheckoutTest): string[] => {
  const mParticleAttributeTemplates = new Set<string>();
  test.variants.forEach((variant) => {
    addMParticleTemplates(variant.heading, mParticleAttributeTemplates);
    addMParticleTemplates(variant.subheading, mParticleAttributeTemplates);
    if (variant.amounts.mParticleAmountAttribute) {
      mParticleAttributeTemplates.add(variant.amounts.mParticleAmountAttribute);
    }
  });
  return [...mParticleAttributeTemplates];
};
