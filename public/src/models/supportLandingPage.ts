import { Methodology, Status, Variant } from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface SupportLandingPageCopy {
  heading: string;
  subheading: string;
}

export interface SupportLandingPageVariant extends Variant {
  name: string;
  copy: SupportLandingPageCopy;
}

export interface Targeting {
  countryGroups: Region[];
}

export interface SupportLandingPageTest {
  name: string;
  nickname?: string;
  status: Status;
  targeting: Targeting;
  variants: SupportLandingPageVariant[];
  methodologies?: Methodology[];
}
