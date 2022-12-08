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
} from '../components/channelManagement/helpers/shared';
import { Region } from '../utils/models';
import { ControlProportionSettings } from '../components/channelManagement/helpers/controlProportionSettings';

export interface SeparateArticleCount {
  type: 'above';
}

export interface EpicVariant extends Variant {
  heading?: string;
  paragraphs: string[];
  highlightedText?: string;
  footer?: string;
  showTicker: boolean;
  tickerSettings?: TickerSettings;
  image?: Image;
  cta?: Cta;
  secondaryCta?: SecondaryCta;
  separateArticleCount?: SeparateArticleCount;
  showChoiceCards?: boolean;
  defaultChoiceCardFrequency?: ContributionFrequency;
  bylineWithImage?: BylineWithImage;
  showSignInLink?: boolean;
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
}
