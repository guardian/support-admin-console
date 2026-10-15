import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  PageContextTargeting,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export type Inline1Variant = Variant;

export interface Inline1Test extends Test {
  name: string;
  nickname?: string;
  status: Status;
  locations: Region[];
  regionTargeting: RegionTargeting;
  userCohort?: UserCohort;
  contextTargeting: PageContextTargeting;
  mParticleAudience?: number;
  variants: Inline1Variant[];
  controlProportionSettings?: ControlProportionSettings;
}
