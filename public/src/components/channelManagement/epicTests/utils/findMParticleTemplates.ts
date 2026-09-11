import { EpicTest } from '../../../../models/epic';
import { addMParticleTemplates } from '../../helpers/addMParticleTemplates';

export const findMParticleTemplates = (test: EpicTest): string[] => {
  const mParticleAttributeTemplates = new Set<string>();
  test.variants.forEach((variant) => {
    addMParticleTemplates(variant.heading, mParticleAttributeTemplates);
    variant.paragraphs.forEach((paragraph) => {
      addMParticleTemplates(paragraph, mParticleAttributeTemplates);
    });
    addMParticleTemplates(variant.highlightedText, mParticleAttributeTemplates);
  });
  return [...mParticleAttributeTemplates];
};
