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

export type BannerDesignProps = {
  image: BannerDesignImage;
  colours: {
    basic: BasicColours;
  };
};

export type Status = 'Live' | 'Draft';

export type BannerDesign = {
  name: string;
  status: Status;
  isNew?: boolean;
  lockStatus?: LockStatus;
} & BannerDesignProps;
