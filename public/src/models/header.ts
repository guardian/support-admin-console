import { Cta, Test, Variant, UserCohort } from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export interface HeaderContent {
  heading?: string;
  subheading?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export interface HeaderVariant extends Variant {
  name: string;
  content: HeaderContent;
  mobileContent?: HeaderContent;
}

export interface HeaderTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  userCohort: UserCohort;
  locations: Region[];
  variants: HeaderVariant[];
  controlProportionSettings?: ControlProportionSettings;
}
