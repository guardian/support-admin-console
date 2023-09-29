import { LockStatus } from '../components/channelManagement/helpers/shared';

interface BannerDesignImage {
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

export type BannerDesignProps = {
  image: BannerDesignImage;
  colours: {
    basic: {
      background: HexColour;
      bodyText: HexColour;
    };
  };
};

export type Status = 'Live' | 'Draft';

export type BannerDesign = {
  name: string;
  status: Status;
  isNew?: boolean;
  lockStatus?: LockStatus;
} & BannerDesignProps;

export const hexColourToString = (h: HexColour): string => `${h.r}${h.g}${h.b}`;
