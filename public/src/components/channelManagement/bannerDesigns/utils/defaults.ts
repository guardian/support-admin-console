import { BannerDesign } from '../../../../models/bannerDesign';
import { stringToHexColour } from '../../../../utils/bannerDesigns';

export const createDefaultBannerDesign = (name: string): BannerDesign => ({
  name,
  status: 'Draft',
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
      background: stringToHexColour('F1F8FC'),
      bodyText: stringToHexColour('000000'),
      headerText: stringToHexColour('000000'),
      articleCountText: stringToHexColour('000000'),
    },
    highlightedText: {
      text: stringToHexColour('000000'),
      highlight: stringToHexColour('FFE500'),
    },
    primaryCta: {
      default: {
        text: stringToHexColour('FFFFFF'),
        background: stringToHexColour('0077B6'),
      },
      hover: {
        text: stringToHexColour('FFFFFF'),
        background: stringToHexColour('004E7C'),
      },
    },
    secondaryCta: {
      default: {
        text: stringToHexColour('004E7C'),
        background: stringToHexColour('F1F8FC'),
        border: stringToHexColour('004E7C'),
      },
      hover: {
        text: stringToHexColour('004E7C'),
        background: stringToHexColour('E5E5E5'),
        border: stringToHexColour('004E7C'),
      },
    },
    closeButton: {
      default: {
        text: stringToHexColour('052962'),
        background: stringToHexColour('F1F8FC'),
        border: stringToHexColour('052962'),
      },
      hover: {
        text: stringToHexColour('052962'),
        background: stringToHexColour('E5E5E5'),
      },
    },
    guardianRoundel: 'inverse',
  },
});
