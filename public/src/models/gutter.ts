import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  Cta,
  DeviceType,
  Image,
  PageContextTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface GutterContent {
  image: Image;
  bodyCopy: string[];
  cta?: Cta;
}

export interface GutterVariant extends Variant {
  gutterContent: GutterContent;
}

export interface GutterTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  variants: GutterVariant[];
  contextTargeting: PageContextTargeting;
  controlProportionSettings?: ControlProportionSettings;
  deviceType: DeviceType;
}
