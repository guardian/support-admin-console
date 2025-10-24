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
  RegionTargeting,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import { SeparateArticleCount } from './epic';
import { ChoiceCardsSettings } from './choiceCards';

export interface BannerUi {
  designName: string;
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
  template: BannerUi;
  bannerContent: BannerContent;
  mobileBannerContent?: BannerContent;
  separateArticleCount?: boolean;
  separateArticleCountSettings?: SeparateArticleCount;
  tickerSettings?: TickerSettings;
  choiceCardsSettings?: ChoiceCardsSettings;
  promoCodes?: string[];
}

export interface BannerTestDeploySchedule {
  daysBetween: number;
}

export interface BannerTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  userCohort: UserCohort;
  locations: Region[];
  regionTargeting: RegionTargeting;
  variants: BannerVariant[];
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
  deviceType?: DeviceType;
  campaignName?: string;
  contextTargeting: PageContextTargeting;
  deploySchedule?: BannerTestDeploySchedule;
  frontsOnly?: boolean;
}
