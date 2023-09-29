import { LockStatus } from '../components/channelManagement/helpers/shared';

interface BannerDesignImage {
  mobileUrl: string;
  tabletDesktopUrl: string;
  wideUrl: string;
  altText: string;
}
type HexChar =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F';

type HexValue = `${HexChar}${HexChar}`;

export interface HexColour {
  r: HexValue;
  g: HexValue;
  b: HexValue;
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
