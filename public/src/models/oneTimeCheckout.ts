import type {
  Methodology,
  Status,
  Test,
  TickerSettings,
  Variant,
} from '../components/channelManagement/helpers/shared';
import type { AmountValuesObject } from '../utils/models';

export interface OneTimeCheckoutVariant extends Variant {
  heading: string;
  subheading: string;
  amounts: AmountValuesObject;
  tickerSettings?: TickerSettings;
}

export interface OneTimeCheckoutTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: OneTimeCheckoutVariant[];
  methodologies: Methodology[];
  mParticleAudience?: number;
}
