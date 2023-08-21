import { LockStatus } from '../components/channelManagement/helpers/shared';

interface BannerDesignImage {
  mobileUrl: string;
  tabletDesktopUrl: string;
  wideUrl: string;
  altText: string;
}

export interface BannerDesign {
  name: string;
  image: BannerDesignImage;
  isNew?: boolean;
  lockStatus?: LockStatus;
}
