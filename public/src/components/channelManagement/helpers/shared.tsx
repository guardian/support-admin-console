import {ValidationStatus} from "./validation";

export const currencyTemplate = "%%CURRENCY_SYMBOL%%";
export const countryNameTemplate = "%%COUNTRY_NAME%%";
export const articleCountTemplate = "%%ARTICLE_COUNT%%";

export interface LockStatus {
  locked: boolean,
  email?: string,
  timestamp?: string
};

export interface TestStatus {
  isValid: boolean,
  isDeleted: boolean,
  isNew: boolean,
  isArchived: boolean
}

export interface Cta {
  text?: string,
  baseUrl?: string
}

export const defaultCta = {
  text: "Support The Guardian",
  baseUrl: "https://support.theguardian.com/contribute"
};


export enum UserCohort {
  Everyone = 'Everyone',
  AllExistingSupporters = 'AllExistingSupporters',
  AllNonSupporters = 'AllNonSupporters',
  PostAskPauseSingleContributors = 'PostAskPauseSingleContributors'
}

// Stores tests which have been modified
export type ModifiedTests = {
  [testName: string]: TestStatus
};

export interface ArticlesViewedSettings {
  minViews: number | null,
  maxViews: number | null,
  periodInWeeks: number,
}

export interface TestEditorState {
    validationStatus: ValidationStatus
}
