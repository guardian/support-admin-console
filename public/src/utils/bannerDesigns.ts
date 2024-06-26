import { BannerVariant } from '../models/banner';
import { BannerDesign, HexColour } from '../models/bannerDesign';

export const getDesignForVariant = (
  variant: BannerVariant,
  designs: BannerDesign[],
): BannerDesign | undefined => {
  const template = variant.template;

  return designs.find(d => d.name === template.designName);
};

export const hexColourStringRegex = /^([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;

const isValidHexColourString = (colourString: string): boolean =>
  hexColourStringRegex.test(colourString);

export const stringToHexColour = (colourString: string): HexColour => {
  if (isValidHexColourString(colourString)) {
    const matches = hexColourStringRegex.exec(colourString);
    return {
      r: (matches?.[1] as string).toUpperCase(),
      g: (matches?.[2] as string).toUpperCase(),
      b: (matches?.[3] as string).toUpperCase(),
      kind: 'hex',
    };
  } else {
    throw new Error('Invalid hex colour string!');
  }
};

export const hexColourToString = (h: HexColour): string => `${h.r}${h.g}${h.b}`;
