import { HeaderTest } from '../../../../models/header';
import { addMParticleTemplates } from '../../helpers/addMParticleTemplates';

export const findMParticleTemplates = (test: HeaderTest): string[] => {
  const mParticleAttributeTemplates = new Set<string>();
  test.variants.forEach((variant) => {
    addMParticleTemplates(variant.content.heading, mParticleAttributeTemplates);
    addMParticleTemplates(variant.content.subheading, mParticleAttributeTemplates);
  });
  return [...mParticleAttributeTemplates];
};
