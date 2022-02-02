import {
  ArticlesViewedSettings,
  Cta,
  Test,
  Variant,
  UserCohort,
  SecondaryCta,
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
  UsEoyMomentBanner = 'UsEoyMomentBanner',
  UsEoyMomentGivingTuesdayBanner = 'UsEoyMomentGivingTuesdayBanner',
  GlobalNewYearBanner = 'GlobalNewYearBanner',
}

export interface BannerContent {
  heading?: string;
  messageText: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}
export interface BannerVariant extends Variant {
  template: BannerTemplate;
  bannerContent: BannerContent;
  mobileBannerContent?: BannerContent;

  // Deprecated - use bannerContent / mobileBannerContent
  heading?: string;
  body?: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: Cta;
  separateArticleCount?: boolean;
}

export interface BannerTest extends Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  minArticlesBeforeShowingBanner: number;
  userCohort: UserCohort;
  locations: Region[];
  variants: BannerVariant[];
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
}
