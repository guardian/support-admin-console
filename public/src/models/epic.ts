import {
  ArticlesViewedSettings,
  ContributionFrequency,
  Cta,
  DeviceType,
  Image,
  SecondaryCta,
  Status,
  Test,
  TickerSettings,
  UserCohort,
  BylineWithImage,
  Variant,
  NewsletterSignup,
  RegionTargeting,
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';
import { ChoiceCardsSettings } from './choiceCards';

export interface SeparateArticleCount {
  type: 'above';
  copy?: string;
}

export type CollapsibleVariant = 'maybeLater' | 'close';

export interface EpicVariant extends Variant {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  image?: Image;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
  separateArticleCount?: SeparateArticleCount;
  promoCodes?: string[];
  showChoiceCards?: boolean;
  choiceCardsSettings?: ChoiceCardsSettings;
  defaultChoiceCardFrequency?: ContributionFrequency; // deprecated, use choiceCardSettings
  bylineWithImage?: BylineWithImage;
  showSignInLink?: boolean;
  newsletterSignup?: NewsletterSignup;
  isCollapsible?: boolean;
  collapsibleVariant?: CollapsibleVariant;
}

export interface MaxEpicViews {
  maxViewsCount: number;
  maxViewsDays: number;
  minDaysBetweenViews: number;
}

export interface EpicTest extends Test {
  name: string;
  nickname?: string;
  status: Status;
  locations: Region[];
  regionTargeting: RegionTargeting;
  tagIds: string[];
  sections: string[];
  excludedTagIds: string[];
  excludedSections: string[];
  alwaysAsk: boolean;
  maxViews?: MaxEpicViews;
  userCohort: UserCohort;
  hasCountryName: boolean;
  variants: EpicVariant[];
  highPriority: boolean; // has been removed from form, but might be used in future
  useLocalViewLog: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
  controlProportionSettings?: ControlProportionSettings;
  deviceType?: DeviceType;
  campaignName?: string;
  mParticleAudience?: number;
}
