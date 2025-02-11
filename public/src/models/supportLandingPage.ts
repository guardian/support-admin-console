import {
  Cta,
  DeviceType,
  SecondaryCta,
  Status,
  Test,
  TickerSettings,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export interface SupportLandingPageVariant extends Variant {
  tickerSettings?: TickerSettings;
}
export interface SupportLandingPageContent {
  heading?: string;
  messageText?: string;
  paragraphs: string[];
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}

export interface SupportLandingPageVariant extends Variant {
  bannerContent: SupportLandingPageContent;
  mobileBannerContent?: SupportLandingPageContent;
  tickerSettings?: TickerSettings;
}

export interface SupportLandingPageTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  variants: SupportLandingPageVariant[];
  deviceType?: DeviceType;
  campaignName?: string;
}
