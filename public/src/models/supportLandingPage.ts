import {
  Methodology,
  RegionTargeting,
  Status,
  Test,
  Variant,
} from '../components/channelManagement/helpers/shared';

export interface SupportLandingPageCopy {
  heading: string;
  subheading: string;
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
}

export interface SupportLandingPageTestTargeting {
  regionTargeting: RegionTargeting;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  targeting: SupportLandingPageTestTargeting;
  variants: SupportLandingPageVariant[];
  methodologies: Methodology[];
}
