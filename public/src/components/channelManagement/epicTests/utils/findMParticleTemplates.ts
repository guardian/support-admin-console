import { EpicTest } from '../../../../models/epic';

export const findMParticleTemplates = (test: EpicTest): string[] => {
  const mParticleAttributeTemplates = new Set<string>();
  test.variants.forEach((variant) => {
    if (variant.heading) {
      for (const templateMatch of variant.heading.matchAll(/%%mParticle_([^%]+)%%/g)) {
        mParticleAttributeTemplates.add(templateMatch[1]);
      }
    }
    variant.paragraphs.forEach((paragraph) => {
      for (const templateMatch of paragraph.matchAll(/%%mParticle_([^%]+)%%/g)) {
        mParticleAttributeTemplates.add(templateMatch[1]);
      }
    });
  });
  return [...mParticleAttributeTemplates];
};
