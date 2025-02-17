import { Methodology, Status, Test, Variant } from '../components/channelManagement/helpers/shared';

export interface SupportLandingPageCopy {
  heading: string;
  subheading: string;
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  variants: SupportLandingPageVariant[];
  methodologies: Methodology[];
}
