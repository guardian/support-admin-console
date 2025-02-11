import {
  DeviceType,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface SupportLandingPageCopy {
  heading: string;
  subheading: string;
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  targeting: string[];
  variants: SupportLandingPageVariant[];
  deviceType?: DeviceType;
}
