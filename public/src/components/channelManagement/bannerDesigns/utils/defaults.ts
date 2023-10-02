import { BannerDesign } from '../../../../models/bannerDesign';
import { stringToHexColour } from '../../../../utils/bannerDesigns';

export type BannerDesignFormData = {
  image: {
    mobileUrl: string;
    tabletDesktopUrl: string;
    wideUrl: string;
    altText: string;
  };
  colours: {
    basic: {
      background: string;
      bodyText: string;
    };
  };
};

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
    },
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
    },
  },
});
