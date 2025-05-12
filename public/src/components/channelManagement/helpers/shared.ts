import { Region } from '../../../utils/models';
import { ValidationStatus } from './validation';

export interface Variant {
  name: string;
}

export type TestPlatform = 'AMP' | 'APPLE_NEWS' | 'DOTCOM';

export type TestType = 'EPIC' | 'BANNER' | 'GUTTER' | 'HEADER' | 'LANDING_PAGE';

export type EpicModuleName = 'ContributionsEpic' | 'ContributionsLiveblogEpic';

export type Status = 'Live' | 'Draft' | 'Archived';

interface ABTestMethodology {
  name: 'ABTest';
}
interface EpsilonGreedyBanditMethodology {
  name: 'EpsilonGreedyBandit';
  epsilon: number;
  sampleCount?: number;
}
interface RouletteMethodology {
  name: 'Roulette';
  sampleCount?: number;
}
// each methodology may have an optional testName, which should be used for tracking
export type Methodology = { testName?: string } & (
  | ABTestMethodology
  | EpsilonGreedyBanditMethodology
  | RouletteMethodology
);
export type BanditMethodology = Exclude<Methodology, { name: 'ABTest' }>;

export interface Test {
  name: string;
  nickname?: string;
  status: Status;
  lockStatus?: LockStatus;
  articlesViewedSettings?: ArticlesViewedSettings;
  variants: Variant[];
  locations: Region[];
  regionTargeting: RegionTargeting;
  isNew?: boolean; // true if test has not yet been POSTed to backend
  campaignName?: string;
  priority?: number;
  userCohort?: string;
  channel?: string;
  signedInStatus?: SignedInStatus;
  consentStatus?: ConsentStatus;
  methodologies: Methodology[];
}

export interface EpicEditorConfig {
  // test level settings
  allowMultipleVariants: boolean;
  allowCustomVariantSplit: boolean;
  allowMethodologyEditor: boolean;
  allowContentTargeting: boolean;
  allowLocationTargeting: boolean;
  supportedRegions?: Region[];
  allowSupporterStatusTargeting: boolean;
  allowDeviceTypeTargeting: boolean;
  showSignedInStatusSelector: boolean;
  allowViewFrequencySettings: boolean;
  allowArticleCount: boolean;
  testNamePrefix?: string;
  platform: TestPlatform;

  // variant level settings
  allowVariantHeader: boolean;
  allowVariantHighlightedText: boolean;
  allowVariantImageUrl: boolean;
  allowVariantCustomPrimaryCta: boolean;
  allowVariantSecondaryCta: boolean;
  allowVariantCustomSecondaryCta: boolean;
  allowVariantSeparateArticleCount: boolean;
  allowVariantTicker: boolean;
  allowVariantChoiceCards: boolean;
  allowVariantSignInLink: boolean;
  allowBylineWithImage: boolean;
  allowVariantPreview: boolean;
  requireVariantHeader: boolean;
  moduleName: EpicModuleName;
  allowNewsletterSignup: boolean;
}

export const ARTICLE_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowMethodologyEditor: true,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowDeviceTypeTargeting: true,
  showSignedInStatusSelector: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: true,
  allowVariantCustomPrimaryCta: true,
  allowVariantSecondaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantSeparateArticleCount: true,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: true,
  allowBylineWithImage: true,
  allowVariantPreview: true,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'DOTCOM',
  allowNewsletterSignup: false,
};

export const LIVEBLOG_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowMethodologyEditor: false,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowDeviceTypeTargeting: true,
  showSignedInStatusSelector: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: true,
  allowVariantHighlightedText: false,
  allowVariantImageUrl: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantSecondaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: false,
  allowBylineWithImage: false,
  allowVariantPreview: true,
  requireVariantHeader: false,
  moduleName: 'ContributionsLiveblogEpic',
  platform: 'DOTCOM',
  allowNewsletterSignup: true,
};

export const APPLE_NEWS_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: false,
  allowCustomVariantSplit: false,
  allowMethodologyEditor: false,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  supportedRegions: ['UnitedStates', 'AUDCountries', 'GBPCountries'],
  allowSupporterStatusTargeting: false,
  allowDeviceTypeTargeting: false,
  showSignedInStatusSelector: false,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantCustomPrimaryCta: false,
  allowVariantSecondaryCta: false,
  allowVariantCustomSecondaryCta: false,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: false,
  allowVariantChoiceCards: false,
  allowVariantSignInLink: false,
  allowBylineWithImage: true,
  allowVariantPreview: false,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'APPLE_NEWS',
  allowNewsletterSignup: false,
};

export const AMP_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: false,
  allowMethodologyEditor: false,
  allowContentTargeting: false,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: false,
  allowDeviceTypeTargeting: false,
  showSignedInStatusSelector: false,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantSecondaryCta: true,
  allowVariantCustomSecondaryCta: false,
  allowVariantSeparateArticleCount: false,
  allowVariantTicker: true,
  allowVariantChoiceCards: true,
  allowVariantSignInLink: false,
  allowBylineWithImage: false,
  allowVariantPreview: false,
  requireVariantHeader: false,
  moduleName: 'ContributionsEpic',
  platform: 'AMP',
  allowNewsletterSignup: false,
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

export interface NewsletterSignup {
  newsletterId: string;
  successDescription: string;
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

export interface PageContextTargeting {
  tagIds: string[]; // tags must include one of these
  sectionIds: string[]; // section must be one of these
  excludedTagIds: string[]; // tags must not include one of these
  excludedSectionIds: string[]; // section must not be one of these
}

// Stores tests which have been modified
export type ModifiedTests = {
  [testName: string]: TestStatus;
};

export interface ArticlesViewedSettings {
  minViews: number;
  maxViews: number | null;
  periodInWeeks: number;
  tagIds: string[] | null;
}

export interface TestEditorState {
  validationStatus: ValidationStatus;
}

export enum TickerName {
  US = 'US',
  AU = 'AU',
  GLOBAL = 'global',
}

interface TickerCopy {
  countLabel: string;
  goalCopy: string;
}
export interface TickerSettings {
  currencySymbol: string;
  copy: TickerCopy;
  name: TickerName;
}

export interface CountDownSettings {
  label: string;
  countdownStartInMillis: string;
  countdownDeadlineInMillis: string;
  theme: {
    backgroundColor: string;
    foregroundColor: string;
  };
}

export type ContributionFrequency = 'ONE_OFF' | 'MONTHLY' | 'ANNUAL';

export type DeviceType = 'Mobile' | 'Desktop' | 'All' | 'iOS' | 'Android';

export type ConsentStatus = 'HasConsented' | 'HasNotConsented' | 'All';

export interface Image {
  mainUrl: string;
  altText: string;
}

export interface BylineWithImage {
  name: string;
  description?: string;
  headshot?: Image;
}

export type SignedInStatus = 'SignedIn' | 'SignedOut' | 'All';

export interface RegionTargeting {
  targetedCountryGroups: Region[];
  targetedCountryCodes?: string[];
}
