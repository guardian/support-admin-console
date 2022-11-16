import {
  ArticlesViewedSettings,
  Cta,
  Test,
  Variant,
  UserCohort,
  SecondaryCta,
  DeviceType,
  Status,
  TickerSettings,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export enum BannerTemplate {
  ContributionsBanner = 'ContributionsBanner',
  ContributionsBannerWithSignIn = 'ContributionsBannerWithSignIn',
  DigitalSubscriptionsBanner = 'DigitalSubscriptionsBanner',
  GuardianWeeklyBanner = 'GuardianWeeklyBanner',
  InvestigationsMomentBanner = 'InvestigationsMomentBanner',
  EnvironmentMomentBanner = 'EnvironmentMomentBanner',
  GlobalNewYearBanner = 'GlobalNewYearBanner',
  AuBrandMomentBanner = 'AuBrandMomentBanner',
  ClimateCrisisMomentBanner = 'ClimateCrisisMomentBanner',
}

export interface BannerContent {
  heading?: string;
  messageText?: string;
  paragraphs: string[];
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}
export interface BannerVariant extends Variant {
  template: BannerTemplate;
  bannerContent: BannerContent;
  mobileBannerContent?: BannerContent;
  separateArticleCount?: boolean;
  tickerSettings?: TickerSettings;
}

export interface BannerTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  minArticlesBeforeShowingBanner: number;
  userCohort: UserCohort;
  locations: Region[];
  variants: BannerVariant[];
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
  deviceType?: DeviceType;
  campaignName?: string;
}
