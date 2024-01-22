import {
  BannerDesign,
  BannerDesignImage,
  ChoiceCardsDesign,
} from '../../../../models/bannerDesign';
import { stringToHexColour } from '../../../../utils/bannerDesigns';

export const defaultBannerImage: BannerDesignImage = {
  kind: 'Image',
  mobileUrl:
    'https://i.guim.co.uk/img/media/630a3735c02e195be89ab06fd1b8192959e282ab/0_0_1172_560/500.png?width=500&quality=75&s=937595b3f471d6591475955335c7c023',
  tabletDesktopUrl:
    'https://i.guim.co.uk/img/media/20cc6e0fa146574bb9c4ed410ac1a089fab02ce0/0_0_1428_1344/500.png?width=500&quality=75&s=fe64f647f74a3cb671f8035a473b895f',
  wideUrl:
    'https://i.guim.co.uk/img/media/6c933a058d1ce37a5ad17f79895906150812dfee/0_0_1768_1420/500.png?width=500&quality=75&s=9277532ddf184a308e14218e3576543b',

  altText: 'Image description',
};

export const defaultBannerChoiceCardsDesign: ChoiceCardsDesign = {
  kind: 'ChoiceCards',
  buttonColour: stringToHexColour('FFFFFF'),
  buttonTextColour: stringToHexColour('767676'),
  buttonBorderColour: stringToHexColour('999999'),
  buttonSelectColour: stringToHexColour('E3F6FF'),
  buttonSelectTextColour: stringToHexColour('062962'),
  buttonSelectBorderColour: stringToHexColour('017ABC'),
};

export const createDefaultBannerDesign = (name: string): BannerDesign => ({
  name,
  status: 'Draft',
  visual: defaultBannerChoiceCardsDesign,
  colours: {
    basic: {
      background: stringToHexColour('F1F8FC'),
      bodyText: stringToHexColour('000000'),
      headerText: stringToHexColour('000000'),
      articleCountText: stringToHexColour('000000'),
      logo: stringToHexColour('000000'),
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
    ticker: {
      text: stringToHexColour('052962'),
      filledProgress: stringToHexColour('052962'),
      progressBarBackground: stringToHexColour('FFFFFF'),
      goalMarker: stringToHexColour('000000'),
    },
  },
});
