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
import { ResponsiveImage } from './shared';

interface Inline1SupportMessage {
  type: 'Inline1SupportMessage';
  heading: string;
  body: string; // paragraphs?
  primaryCta: Cta; // mandatory?
  secondaryCta?: Cta;
  image?: ResponsiveImage;
}
interface Inline1PuzzlesMessage {
  type: 'Inline1PuzzlesMessage';
  // is anything configurable?
}
interface Inline1NewsletterMessage {
  type: 'Inline1NewsletterMessage';
  newsletterId: string;
  frequency: string; // e.g. "Weekly"
  heading: string;
  body: string;
  imageUrl?: string; // optional?
}

type Inline1Message = Inline1SupportMessage | Inline1PuzzlesMessage | Inline1NewsletterMessage;

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
