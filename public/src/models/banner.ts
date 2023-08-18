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
import BannerTemplateSelector from '../components/channelManagement/bannerTests/bannerTemplateSelector';

export enum BannerTemplate {
  AusAnniversaryBanner = 'AusAnniversaryBanner',
  ContributionsBanner = 'ContributionsBanner',
  ContributionsBannerWithSignIn = 'ContributionsBannerWithSignIn',
  ChoiceCardsBannerBlue = 'ChoiceCardsBannerBlue',
  ChoiceCardsBannerYellow = 'ChoiceCardsBannerYellow',
  ChoiceCardsButtonsBannerBlue = 'ChoiceCardsButtonsBannerBlue',
  ChoiceCardsButtonsBannerYellow = 'ChoiceCardsButtonsBannerYellow',
  DigitalSubscriptionsBanner = 'DigitalSubscriptionsBanner',
  PrintSubscriptionsBanner = 'PrintSubscriptionsBanner',
  GuardianWeeklyBanner = 'GuardianWeeklyBanner',
  InvestigationsMomentBanner = 'InvestigationsMomentBanner',
  EnvironmentMomentBanner = 'EnvironmentMomentBanner',
  GlobalNewYearBanner = 'GlobalNewYearBanner',
  CharityAppealBanner = 'CharityAppealBanner',
  UkraineMomentBanner = 'UkraineMomentBanner',
  WorldPressFreedomDayBanner = 'WorldPressFreedomDayBanner',
  Scotus2023MomentBanner = 'Scotus2023MomentBanner',
}

export interface BannerDesignName {
  name: string;
}

export type BannerUI = BannerTemplate | BannerDesignName;

export interface BannerContent {
  heading?: string;
  messageText?: string;
  paragraphs: string[];
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
}
export interface BannerVariant extends Variant {
  template: BannerUI;
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

export function isBannerTemplate(s: BannerUI | string): s is BannerTemplate {
  return Object.values(BannerTemplate).includes(s as BannerTemplate);
}
