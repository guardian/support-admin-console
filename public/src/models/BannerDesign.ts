import { LockStatus } from '../components/channelManagement/helpers/shared';

export interface BannerDesign {
  name: string;
  imageUrl: string;
  isNew?: boolean;
  lockState?: LockStatus;
}
