import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  Cta,
  PageContextTargeting,
  Status,
  Test,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface GutterContent {
  imageUrl: string; // should this be a URL type?
  altText: string; // this might be better in a new type - or perhaps one exists already.
  bodyCopy: string;
  cta: Cta;
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
  // TODO: we don't want the deviceType: but it's compulsory currently. Can we investigate the Epic configuration tool?
  // contextTargeting: { excludedTagIds: [] };
  controlProportionSettings?: ControlProportionSettings; // AB test proportions
  campaignName?: string;
  contextTargeting: PageContextTargeting; // TODO: tags but we just want the excluded tags...
}
