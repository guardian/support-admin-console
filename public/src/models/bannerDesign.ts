import { LockStatus } from '../components/channelManagement/helpers/shared';

export interface HexColour {
  r: string;
  g: string;
  b: string;
  kind: 'hex';
}

export interface BasicColours {
  background: HexColour;
  bodyText: HexColour;
  headerText: HexColour;
  articleCountText: HexColour;
  logo: HexColour;
}

export interface HighlightedTextColours {
  text: HexColour;
  highlight: HexColour;
}

interface CtaStateDesign {
  text: HexColour;
  background: HexColour;
  border?: HexColour;
}
export interface CtaDesign {
  default: CtaStateDesign;
  hover: CtaStateDesign;
}

export interface TickerDesign {
  text: HexColour;
  filledProgress: HexColour;
  progressBarBackground: HexColour;
  goalMarker: HexColour;
}

export interface BannerDesignHeaderImage {
  mobileUrl: string;
  tabletUrl: string;
  desktopUrl: string;
  altText: string;
}

export interface BannerDesignImage extends BannerDesignHeaderImage {
  kind: 'Image';
}

export interface ChoiceCardsDesign {
  kind: 'ChoiceCards';
  buttonColour?: HexColour;
  buttonTextColour?: HexColour;
  buttonBorderColour?: HexColour;
  buttonSelectColour?: HexColour;
  buttonSelectTextColour?: HexColour;
  buttonSelectBorderColour?: HexColour;
}
export type BannerDesignVisual = BannerDesignImage | ChoiceCardsDesign;

export type BannerDesignProps = {
  visual?: BannerDesignVisual;
  headerImage?: BannerDesignHeaderImage;
  colours: {
    basic: BasicColours;
    highlightedText: HighlightedTextColours;
    primaryCta: CtaDesign;
    secondaryCta: CtaDesign;
    closeButton: CtaDesign;
    ticker: TickerDesign;
  };
};

export type Status = 'Live' | 'Draft';

export type BannerDesign = {
  name: string;
  status: Status;
  isNew?: boolean;
  lockStatus?: LockStatus;
} & BannerDesignProps;
