import { LockStatus } from '../components/channelManagement/helpers/shared';

export interface BannerDesignImage {
  mobileUrl: string;
  tabletDesktopUrl: string;
  wideUrl: string;
  altText: string;
}
export interface HexColour {
  r: string;
  g: string;
  b: string;
  kind: 'hex';
}

export interface BasicColours {
  background: HexColour;
  bodyText: HexColour;
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

export type GuardianRoundel = 'default' | 'brand' | 'inverse';

export type BannerDesignProps = {
  image: BannerDesignImage;
  colours: {
    basic: {
      background: HexColour;
      bodyText: HexColour;
      headerText: HexColour;
      articleCountText: HexColour;
    };
    highlightedText: {
      text: HexColour;
      highlight: HexColour;
    };
    primaryCta: CtaDesign;
    secondaryCta: CtaDesign;
    closeButton: CtaDesign;
    guardianRoundel?: GuardianRoundel;
  };
};

export type Status = 'Live' | 'Draft';

export type BannerDesign = {
  name: string;
  status: Status;
  isNew?: boolean;
  lockStatus?: LockStatus;
} & BannerDesignProps;
