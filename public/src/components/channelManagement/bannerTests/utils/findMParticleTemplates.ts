import { BannerContent, BannerTest } from '../../../../models/banner';
import { addMParticleTemplates } from '../../helpers/addMParticleTemplates';

const scanText = (content: BannerContent, template: Set<string>): void => {
  addMParticleTemplates(content.heading, template);
  content.paragraphs.forEach((paragraph) => {
    addMParticleTemplates(paragraph, template);
  });
  addMParticleTemplates(content.highlightedText, template);
};

export const findMParticleTemplates = (test: BannerTest): string[] => {
  const mParticleAttributeTemplates = new Set<string>();
  test.variants.forEach((variant) => {
    scanText(variant.bannerContent, mParticleAttributeTemplates);
    if (variant.mobileBannerContent) {
      scanText(variant.mobileBannerContent, mParticleAttributeTemplates);
    }
  });
  return [...mParticleAttributeTemplates];
};
