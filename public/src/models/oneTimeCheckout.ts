import {
  Methodology,
  Status,
  Test,
  Variant,
  TickerSettings,
} from '../components/channelManagement/helpers/shared';
import { AmountValuesObject } from '../utils/models';

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
}
