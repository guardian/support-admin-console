import { Methodology, Status, Test, Variant } from '../components/channelManagement/helpers/shared';

export interface SingleCheckoutVariant extends Variant {
  heading: string;
  subheading: string;
}

export interface SingleCheckoutTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SingleCheckoutVariant[];
  methodologies: Methodology[];
}
