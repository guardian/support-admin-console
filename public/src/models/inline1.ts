import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  PageContextTargeting,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';

export type Inline1Variant = Variant;

export interface Inline1Test extends Test {
  name: string;
  nickname?: string;
  status: Status;
  regionTargeting: RegionTargeting;
  userCohort?: UserCohort;
  contextTargeting: PageContextTargeting;
  mParticleAudience?: number;
  variants: Inline1Variant[];
  controlProportionSettings?: ControlProportionSettings;
}
