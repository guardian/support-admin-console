import {
  Cta,
  Test,
  Variant,
  UserCohort,
  DeviceType,
  Status,
  RegionTargeting,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export interface HeaderContent {
  heading?: string;
  subheading?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export interface HeaderVariant extends Variant {
  name: string;
  content: HeaderContent;
  mobileContent?: HeaderContent;
}

export interface HeaderTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  regionTargeting: RegionTargeting;
  variants: HeaderVariant[];
  controlProportionSettings?: ControlProportionSettings;
  deviceType?: DeviceType;
  campaignName?: string;
}
