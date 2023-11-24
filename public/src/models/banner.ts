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
  PageContextTargeting,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export enum BannerTemplate {
  AusAnniversaryMomentBanner = 'AusAnniversaryMomentBanner',
  ContributionsBanner = 'ContributionsBanner',
  ContributionsBannerWithSignIn = 'ContributionsBannerWithSignIn',
  GuardianWeeklyBanner = 'GuardianWeeklyBanner',
  EnvironmentBanner = 'EnvironmentBanner',
  GlobalNewYearMomentBanner = 'GlobalNewYearMomentBanner',
  UkraineMomentBanner = 'UkraineMomentBanner',
  WorldPressFreedomDayBanner = 'WorldPressFreedomDayBanner',
  Scotus2023MomentBanner = 'Scotus2023MomentBanner',
  EuropeMomentLocalLanguageBanner = 'EuropeMomentLocalLanguageBanner',
  SupporterMomentBanner = 'SupporterMomentBanner',
  EnvironmentMomentBanner = 'EnvironmentMomentBanner',
  ChoiceCardsMomentBanner = 'ChoiceCardsMomentBanner',
}

export interface BannerDesignName {
  designName: string;
}

export type BannerUi = BannerTemplate | BannerDesignName;

export interface BannerContent {
  heading?: string;
  messageText?: string;
  paragraphs: string[];
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}
export interface BannerVariant extends Variant {
  template: BannerUi;
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
  contextTargeting: PageContextTargeting;
}

export function uiIsDesign(ui: BannerUi): ui is BannerDesignName {
  return (ui as BannerDesignName).designName !== undefined;
}

export function isBannerTemplate(s: BannerUi | string): s is BannerTemplate {
  return Object.values(BannerTemplate).includes(s as BannerTemplate);
}
