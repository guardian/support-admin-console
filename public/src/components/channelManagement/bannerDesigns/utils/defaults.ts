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
  tabletUrl:
    'https://i.guim.co.uk/img/media/cb654baf73bec78a73dbd656e865dedc3807ec74/0_0_300_300/300.jpg?width=300&height=300&quality=75&s=28324a5eb4f5f18eabd8c7b1a59ed150',
  desktopUrl:
    'https://i.guim.co.uk/img/media/058e7bd9d7a37983eb01cf981f67bd6efe42f95d/0_0_500_300/500.jpg?width=500&height=300&quality=75&s=632c02ed370780425b323aeb1e98cd80',

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
  fonts: {
    heading: {
      size: 'medium',
    },
  },
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
    },
    secondaryCta: {
      default: {
        text: stringToHexColour('004E7C'),
        background: stringToHexColour('F1F8FC'),
        border: stringToHexColour('004E7C'),
      },
    },
    closeButton: {
      default: {
        text: stringToHexColour('052962'),
        background: stringToHexColour('F1F8FC'),
        border: stringToHexColour('052962'),
      },
    },
    ticker: {
      text: stringToHexColour('052962'), // deprecated
      filledProgress: stringToHexColour('052962'),
      progressBarBackground: stringToHexColour('FFFFFF'),
      goalMarker: stringToHexColour('000000'), //deprecated
      headlineColour: stringToHexColour('052962'),
      totalColour: stringToHexColour('052962'),
      goalColour: stringToHexColour('052962'),
    },
  },
});
