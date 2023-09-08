import { LockStatus } from '../components/channelManagement/helpers/shared';

interface BannerDesignImage {
  mobileUrl: string;
  tabletDesktopUrl: string;
  wideUrl: string;
  altText: string;
}

export type BannerDesignProps = {
  image: BannerDesignImage;
};

export type BannerDesign = {
  name: string;
  isNew?: boolean;
  lockStatus?: LockStatus;
} & BannerDesignProps;
