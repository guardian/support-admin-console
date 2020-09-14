import {
  ArticlesViewedSettings,
  Cta,
  Test,
  UserCohort,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';

export enum BannerTemplate {
  ContributionsBanner = 'ContributionsBanner',
  DigitalSubscriptionsBanner = 'DigitalSubscriptionsBanner',
  GuardianWeeklyBanner = 'GuardianWeeklyBanner',
}
export interface BannerVariant {
  name: string;
  template: BannerTemplate;
  heading?: string;
  body: string;
  highlightedText?: string;
  cta?: Cta;
  secondaryCta?: Cta;
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
}
