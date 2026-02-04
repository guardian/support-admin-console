import {
  PageContextTargeting,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ResponsiveImage } from './shared';

export interface StudentLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  regionTargeting: RegionTargeting;
  variants: StudentLandingPageVariant[];
  contextTargeting: PageContextTargeting;
}

export interface Institution {
  acronym: string;
  name: string;
  logoUrl: string;
}
export interface StudentLandingPageVariant extends Variant {
  heading: string;
  subheading: string;
  institution: Institution;
  promoCodes: string[];
  image: ResponsiveImage;
}
