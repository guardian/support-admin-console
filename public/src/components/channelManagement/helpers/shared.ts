import { Region } from '../../../utils/models';
import { ValidationStatus } from './validation';

export interface Variant {
  name: string;
}

export type TestPlatform = 'AMP' | 'APPLE_NEWS' | 'DOTCOM';

export type TestType = 'EPIC' | 'BANNER' | 'HEADER';

export type EpicModuleName = 'ContributionsEpic' | 'ContributionsLiveblogEpic';

export type Status = 'Live' | 'Draft' | 'Archived';

export const setStatus = (isOn: boolean): Status => (isOn ? 'Live' : 'Draft');

export interface Test {
  name: string;
  nickname?: string;
  isOn: boolean; // Deprecated and soon to be removed, use status instead
  status: Status;
  lockStatus?: LockStatus;
  articlesViewedSettings?: ArticlesViewedSettings;
  variants: Variant[];
  locations: Region[];
  isNew?: boolean; // true if test has not yet been POSTed to backend
  campaignName?: string;
  priority?: number;
  userCohort?: string;
  channel?: string;
}

export interface EpicEditorConfig {
  // test level settings
  allowMultipleVariants: boolean;
  allowCustomVariantSplit: boolean;
  allowContentTargeting: boolean;
  allowLocationTargeting: boolean;
  supportedRegions?: Region[];
  allowSupporterStatusTargeting: boolean;
  allowDeviceTypeTargeting: boolean;
  allowViewFrequencySettings: boolean;
  allowArticleCount: boolean;
  testNamePrefix?: string;
  platform: TestPlatform;

  // variant level settings
  allowVariantHeader: boolean;
  allowVariantHighlightedText: boolean;
  allowVariantImageUrl: boolean;
  allowVariantFooter: boolean;
  allowVariantCustomPrimaryCta: boolean;
  allowVariantCustomSecondaryCta: boolean;
  allowVariantSeparateArticleCount: boolean;
  allowVariantTicker: boolean;
  allowVariantChoiceCards: boolean;
  allowVariantSignInLink: boolean;
  allowVariantPreview: boolean;
  requireVariantHeader: boolean;
  moduleName: EpicModuleName;
}

export const ARTICLE_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowDeviceTypeTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: true,
  allowVariantFooter: true,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantSeparateArticleCount: true,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: true,
  allowVariantPreview: true,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'DOTCOM',
};

export const ARTICLE_EPIC_HOLDBACK_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: false,
  allowCustomVariantSplit: false,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowDeviceTypeTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  testNamePrefix: 'HOLDBACK',
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: true,
  allowVariantFooter: true,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantSeparateArticleCount: true,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: true,
  allowVariantPreview: true,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'DOTCOM',
};

export const LIVEBLOG_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowDeviceTypeTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: true,
  allowVariantHighlightedText: false,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: false,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: false,
  allowVariantChoiceCards: false,
  allowVariantSignInLink: false,
  allowVariantPreview: true,
  requireVariantHeader: false,
  moduleName: 'ContributionsLiveblogEpic',
  platform: 'DOTCOM',
};

export const APPLE_NEWS_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: false,
  allowCustomVariantSplit: false,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  supportedRegions: [Region.UnitedStates, Region.AUDCountries],
  allowSupporterStatusTargeting: false,
  allowDeviceTypeTargeting: false,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: false,
  allowVariantCustomSecondaryCta: false,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: false,
  allowVariantChoiceCards: false,
  allowVariantSignInLink: false,
  allowVariantPreview: false,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'APPLE_NEWS',
};

export const AMP_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: false,
  allowContentTargeting: false,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: false,
  allowDeviceTypeTargeting: false,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: false,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: false,
  allowVariantPreview: false,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'AMP',
};

export interface LockStatus {
  locked: boolean;
  email?: string;
  timestamp?: string;
}

export interface TestStatus {
  isValid: boolean;
  isDeleted: boolean;
  isNew: boolean;
  isArchived: boolean;
}

export interface Cta {
  text: string;
  baseUrl: string;
}

export enum SecondaryCtaType {
  Custom = 'CustomSecondaryCta',
  ContributionsReminder = 'ContributionsReminderSecondaryCta',
}

interface CustomSecondaryCta {
  type: SecondaryCtaType.Custom;
  cta: Cta;
}

interface ContributionsReminderSecondaryCta {
  type: SecondaryCtaType.ContributionsReminder;
}

export type SecondaryCta = CustomSecondaryCta | ContributionsReminderSecondaryCta;

export enum UserCohort {
  Everyone = 'Everyone',
  AllExistingSupporters = 'AllExistingSupporters',
  AllNonSupporters = 'AllNonSupporters',
  // Not currently supported
  // PostAskPauseSingleContributors = 'PostAskPauseSingleContributors',
}

// Stores tests which have been modified
export type ModifiedTests = {
  [testName: string]: TestStatus;
};

export interface ArticlesViewedSettings {
  minViews: number | null;
  maxViews: number | null;
  periodInWeeks: number;
}

export interface TestEditorState {
  validationStatus: ValidationStatus;
}

export enum TickerEndType {
  unlimited = 'unlimited',
  hardstop = 'hardstop',
}
export enum TickerCountType {
  money = 'money',
  people = 'people',
}
interface TickerCopy {
  countLabel: string;
  goalReachedPrimary: string;
  goalReachedSecondary: string;
}
export interface TickerSettings {
  endType: TickerEndType;
  countType: TickerCountType;
  currencySymbol: string;
  copy: TickerCopy;
}

export type ContributionFrequency = 'ONE_OFF' | 'MONTHLY' | 'ANNUAL';

export type DeviceType = 'Mobile' | 'Desktop' | 'All';

export interface Image {
  mainUrl: string;
  altText: string;
}
