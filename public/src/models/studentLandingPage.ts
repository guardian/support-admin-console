import {
  PageContextTargeting,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface StudentLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  regionTargeting: RegionTargeting;
  variants: [];
  contextTargeting: PageContextTargeting;
}
