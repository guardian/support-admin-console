import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  Cta,
  PageContextTargeting,
  RegionTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';

interface Inline1SupportMessage {
  type: 'Inline1SupportMessage';
  heading: string;
  body: string;
  cta: Cta;
}
interface Inline1PuzzlesMessage {
  type: 'Inline1PuzzlesMessage';
}

type Inline1Message = Inline1SupportMessage | Inline1PuzzlesMessage;

export interface Inline1Variant extends Variant {
  message: Inline1Message;
}

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
