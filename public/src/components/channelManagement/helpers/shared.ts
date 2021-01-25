import { ValidationStatus } from './validation';

export interface Variant {
  name: string;
}

export type TestType = 'EPIC' | 'BANNER';

export interface Test {
  name: string;
  nickname?: string;
  isOn: boolean;
  articlesViewedSettings?: ArticlesViewedSettings;
  variants: Variant[];
}

export interface EpicEditorConfig {
  // test level settings
  allowMultipleVariants: boolean;
  allowCustomVariantSplit: boolean;
  allowContentTargeting: boolean;
  allowLocationTargeting: boolean;
  allowSupporterStatusTargeting: boolean;
  allowViewFrequencySettings: boolean;
  allowArticleCount: boolean;
  testNamePrefix?: string;

  // variant level settings
  allowVariantHeader: boolean;
  allowVariantHighlightedText: boolean;
  allowVariantImageUrl: boolean;
  allowVariantFooter: boolean;
  allowVariantCustomPrimaryCta: boolean;
  allowVariantCustomSecondaryCta: boolean;
  allowVariantTicker: boolean;
}

export const ARTICLE_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: true,
  allowVariantFooter: true,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantTicker: true,
};

export const ARTICLE_EPIC_HOLDBACK_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: false,
  allowCustomVariantSplit: false,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  testNamePrefix: 'HOLDBACK__',
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: true,
  allowVariantFooter: true,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantTicker: true,
};

export const LIVEBLOG_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: true,
  allowContentTargeting: true,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: true,
  allowViewFrequencySettings: true,
  allowArticleCount: true,
  allowVariantHeader: false,
  allowVariantHighlightedText: false,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: true,
  allowVariantTicker: false,
};

export const APPLE_NEWS_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: false,
  allowCustomVariantSplit: false,
  allowContentTargeting: true,
  allowLocationTargeting: false,
  allowSupporterStatusTargeting: true,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: false,
  allowVariantCustomSecondaryCta: false,
  allowVariantTicker: false,
};

export const AMP_EPIC_CONFIG: EpicEditorConfig = {
  allowMultipleVariants: true,
  allowCustomVariantSplit: false,
  allowContentTargeting: false,
  allowLocationTargeting: true,
  allowSupporterStatusTargeting: false,
  allowViewFrequencySettings: false,
  allowArticleCount: false,
  allowVariantHeader: true,
  allowVariantHighlightedText: true,
  allowVariantImageUrl: false,
  allowVariantFooter: false,
  allowVariantCustomPrimaryCta: true,
  allowVariantCustomSecondaryCta: false,
  allowVariantTicker: true,
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
  text?: string;
  baseUrl?: string;
}

export const defaultCta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export enum UserCohort {
  Everyone = 'Everyone',
  AllExistingSupporters = 'AllExistingSupporters',
  AllNonSupporters = 'AllNonSupporters',
  PostAskPauseSingleContributors = 'PostAskPauseSingleContributors',
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
