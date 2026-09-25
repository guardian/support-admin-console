import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import {
  ArticlesViewedSettings,
  Cta,
  DeviceType,
  PageContextTargeting,
  RegionTargeting,
  SecondaryCta,
  Status,
  Test,
  TickerSettings,
  UserCohort,
  Variant,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ChoiceCardsSettings } from './choiceCards';
import { SeparateArticleCount } from './epic';

export interface BannerUi {
  designName: string;
}

export const BannerStepMode = {
  OneStep: 'OneStep',
  TwoStep: 'TwoStep',
  TwoStepIfAllowed: 'TwoStepIfAllowed',
} as const;

export type BannerStepMode = (typeof BannerStepMode)[keyof typeof BannerStepMode];

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
  isCollapsible?: boolean;
  bannerStepMode?: BannerStepMode;
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
  mParticleAudience?: number;
  mParticleTemplates?: string[];
}
