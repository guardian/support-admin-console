import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  Cta,
  DeviceType,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

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
  promoCodes?: string[];
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
  mParticleAudience?: number;
}
