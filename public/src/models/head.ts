import { Cta, Test, Variant, UserCohort } from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export interface HeadContent {
  heading?: string;
  subheading?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

export interface HeadVariant extends Variant {
  name: string;
  content: HeadContent;
  mobileContent?: HeadContent;
}

export interface HeadTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  userCohort: UserCohort;
  locations: Region[];
  variants: HeadVariant[];
  controlProportionSettings?: ControlProportionSettings;
}
