import { BannerDesign } from '../../../../models/bannerDesign';
import { stringToHexColour } from '../../../../utils/bannerDesigns';

export const DEFAULT_BANNER_DESIGN = {
  image: {
    mobileUrl:
      'https://i.guim.co.uk/img/media/35d403182e4b262d37385281b19b763ee6b32f6a/58_0_1743_1046/master/1743.png?width=930&quality=45&auto=format&s=9ecd82413fef9883c1e7a0df2bf6abb1',
    tabletDesktopUrl:
      'https://i.guim.co.uk/img/media/35d403182e4b262d37385281b19b763ee6b32f6a/58_0_1743_1046/master/1743.png?width=930&quality=45&auto=format&s=9ecd82413fef9883c1e7a0df2bf6abb1',
    wideUrl:
      'https://i.guim.co.uk/img/media/35d403182e4b262d37385281b19b763ee6b32f6a/58_0_1743_1046/master/1743.png?width=930&quality=45&auto=format&s=9ecd82413fef9883c1e7a0df2bf6abb1',
    altText: 'Image description',
  },
  colours: {
    basic: {
      background: '222527',
      bodyText: 'FFFFFF',
      headerText: 'FFFFFF',
      articleCountText: 'FFFFFF',
    },
    highlightedText: {
      text: 'FFFFFF',
      highlight: 'FFE500',
    },
    primaryCta: {
      default: {
        text: 'FFFFFF',
        background: '0077B6',
      },
      hover: {
        text: 'FFFFFF',
        background: '004E7C',
      },
    },
    secondaryCta: {
      default: {
        text: '004E7C',
        background: 'F1F8FC',
        border: '004E7C',
      },
      hover: {
        text: '004E7C',
        background: 'E5E5E5',
        border: '004E7C',
      },
    },
    closeButton: {
      default: {
        text: '052962',
        background: 'F1F8FC',
        border: '052962',
      },
      hover: {
        text: '052962',
        background: 'E5E5E5',
      },
    },
    guardianRoundel: 'default',
  },
};

export const createDefaultBannerDesign = (name: string): BannerDesign => ({
  name,
  status: 'Draft',
  image: DEFAULT_BANNER_DESIGN.image,
  colours: {
    basic: {
      background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.basic.background),
      bodyText: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.basic.bodyText),
      headerText: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.basic.headerText),
      articleCountText: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.basic.articleCountText),
    },
    highlightedText: {
      text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.highlightedText.text),
      highlight: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.highlightedText.highlight),
    },
    primaryCta: {
      default: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.primaryCta.default.text),
        background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.primaryCta.default.background),
      },
      hover: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.primaryCta.hover.text),
        background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.primaryCta.hover.background),
      },
    },
    secondaryCta: {
      default: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.secondaryCta.default.text),
        background: stringToHexColour(
          DEFAULT_BANNER_DESIGN.colours.secondaryCta.default.background,
        ),
        border: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.secondaryCta.default.border),
      },
      hover: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.secondaryCta.hover.text),
        background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.secondaryCta.hover.background),
        border: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.secondaryCta.hover.border),
      },
    },
    closeButton: {
      default: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.closeButton.default.text),
        background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.closeButton.default.background),
        border: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.closeButton.default.border),
      },
      hover: {
        text: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.closeButton.hover.text),
        background: stringToHexColour(DEFAULT_BANNER_DESIGN.colours.closeButton.hover.background),
      },
    },
    guardianRoundel: 'default',
  },
});
