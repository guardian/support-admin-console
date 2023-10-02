import { BannerVariant, uiIsDesign } from '../models/banner';
import { BannerDesign, HexColour } from '../models/bannerDesign';

export const getDesignForVariant = (
  variant: BannerVariant,
  designs: BannerDesign[],
): BannerDesign | undefined => {
  const template = variant.template;

  if (uiIsDesign(template)) {
    return designs.find(d => d.name === template.designName);
  }
};

export const hexColourStringRegex = /^([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/;

const isValidHexColourString = (colourString: string): boolean =>
  hexColourStringRegex.test(colourString);

export const convertStringToHexColour = (colourString: string): HexColour => {
  if (isValidHexColourString(colourString)) {
    const matches = hexColourStringRegex.exec(colourString);
    return {
      r: matches?.[1] as string,
      g: matches?.[2] as string,
      b: matches?.[3] as string,
      kind: 'hex',
    };
  } else {
    throw new Error('Invalid hex colour string!');
  }
};
