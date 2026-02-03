import {
  Methodology,
  Status,
  Test,
  Variant,
  TickerSettings,
} from '../components/channelManagement/helpers/shared';
import { AmountValuesObject } from '../utils/models';

export interface SingleCheckoutVariant extends Variant {
  heading: string;
  subheading: string;
  amounts: AmountValuesObject;
  tickerSettings?: TickerSettings;
}

export interface SingleCheckoutTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SingleCheckoutVariant[];
  methodologies: Methodology[];
}
