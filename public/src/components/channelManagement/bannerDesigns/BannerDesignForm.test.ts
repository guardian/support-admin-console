import { colourThemes } from './utils/colourThemes';
import { applyChoiceCardPalette } from './BannerDesignForm';
import type { BannerDesignVisual } from '../../../models/bannerDesign';

const firstTheme = colourThemes.styles[0].themes[0];
if (firstTheme.kind !== 'ChoiceCards') {
  throw new Error('Expected the first theme to be a ChoiceCards theme');
}
const choiceCardColours = firstTheme.colours.choiceCards;

describe('applyChoiceCardPalette', () => {
  it('copies colour and opacity settings to ChoiceCards visuals', () => {
    const visual: BannerDesignVisual = { kind: 'ChoiceCards' };

    expect(applyChoiceCardPalette(visual, choiceCardColours)).toMatchObject({
      kind: 'ChoiceCards',
      buttonColour: { r: 'FF', g: 'FF', b: 'FF', kind: 'hex' },
      buttonOpacity: 0.8,
      buttonSelectColour: { r: 'FF', g: 'FF', b: 'FF', kind: 'hex' },
      buttonSelectOpacity: 0.95,
    });
  });

  it('leaves Image visuals unchanged', () => {
    const visual: BannerDesignVisual = {
      kind: 'Image',
      mobileUrl: 'mobile',
      tabletUrl: 'tablet',
      desktopUrl: 'desktop',
      altText: 'banner',
    };

    expect(applyChoiceCardPalette(visual, choiceCardColours)).toBe(visual);
  });
});
