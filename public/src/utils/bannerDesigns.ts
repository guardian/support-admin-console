import { BannerVariant, uiIsDesign } from '../models/banner';
import { BannerDesign } from '../models/bannerDesign';

export const getDesignForVariant = (
  variant: BannerVariant,
  designs: BannerDesign[],
): BannerDesign | undefined => {
  const template = variant.template;

  if (uiIsDesign(template)) {
    return designs.find(d => d.name === template.designName);
  }
};
