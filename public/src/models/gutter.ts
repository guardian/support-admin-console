import {
  Cta,
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
  contextTargeting: { excludedTagIds: [] };
  // controlProportionSettings?: ControlProportionSettings; // not sure what this is for
  campaignName?: string;
  //contextTargeting: PageContextTargeting; // not sure what this is for
}
