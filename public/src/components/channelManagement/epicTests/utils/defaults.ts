import { Cta, SecondaryCtaType, UserCohort } from '../../helpers/shared';

import { getStage } from '../../../../utils/stage';
import { EpicTest, EpicVariant, MaxEpicViews } from '../../../../models/epic';

export const DEFAULT_MAX_EPIC_VIEWS: MaxEpicViews = {
  maxViewsCount: 4,
  maxViewsDays: 30,
  minDaysBetweenViews: 0,
};

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Continue',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_SECONDARY_CTA: Cta = {
  text: '',
  baseUrl: '',
};

const DEV_AND_CODE_DEFAULT_VARIANT: EpicVariant = {
  name: 'CONTROL',
  paragraphs: [
    "… we have a small favour to ask. You've read %%ARTICLE_COUNT%% articles in the last year. And you’re not alone; millions are flocking to the Guardian for quality news every day. We believe everyone deserves access to factual information, and analysis that has authority and integrity. That’s why, unlike many others, we made a choice: to keep Guardian reporting open for all, regardless of where they live or what they can afford to pay.",
    'As an open, independent news organisation we investigate, interrogate and expose the actions of those in power, without fear. With no shareholders or billionaire owner, our journalism is free from political and commercial bias – this makes us different. We can give a voice to the oppressed and neglected, and stand in solidarity with those who are calling for a fairer future. With your help we can make a difference.',
    'We’re determined to provide journalism that helps each of us better understand the world, and take actions that challenge, unite, and inspire change – in times of crisis and beyond. Our work would not be possible without our readers, who now support our work from 180 countries around the world.',
    'Every reader contribution, however big or small, is so valuable for our future.',
  ],
  highlightedText:
    'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – it only takes a minute. If you can, please consider supporting us with a regular amount each month. Thank you.',
  separateArticleCount: { type: 'above' },
  showTicker: false,
  cta: DEFAULT_PRIMARY_CTA,
  secondaryCta: { type: SecondaryCtaType.ContributionsReminder },
  showChoiceCards: true,
};

const PROD_DEFAULT_VARIANT: EpicVariant = {
  name: 'CONTROL',
  paragraphs: [],
  highlightedText:
    'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1 – it only takes a minute. If you can, please consider supporting us with a regular amount each month. Thank you.',
  separateArticleCount: { type: 'above' },
  showTicker: false,
  cta: DEFAULT_PRIMARY_CTA,
  secondaryCta: { type: SecondaryCtaType.ContributionsReminder },
  showChoiceCards: true,
};

export const getDefaultVariant = (): EpicVariant => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

const DEV_AND_CODE_DEFAULT_TEST: EpicTest = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  locations: [],
  tagIds: [],
  sections: [],
  excludedTagIds: [],
  excludedSections: [],
  alwaysAsk: false,
  maxViews: DEFAULT_MAX_EPIC_VIEWS,
  userCohort: UserCohort.AllNonSupporters, // matches the default in dotcom
  hasCountryName: false,
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  highPriority: false, // has been removed from form, but might be used in future
  useLocalViewLog: false,
  methodologies: [{ name: 'ABTest' }],
};

const PROD_DEFAULT_TEST: EpicTest = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  locations: [],
  tagIds: [],
  sections: [],
  excludedTagIds: [],
  excludedSections: [],
  alwaysAsk: false,
  maxViews: DEFAULT_MAX_EPIC_VIEWS,
  userCohort: UserCohort.AllNonSupporters, // matches the default in dotcom
  hasCountryName: false,
  variants: [],
  highPriority: false, // has been removed from form, but might be used in future
  useLocalViewLog: false,
  methodologies: [{ name: 'ABTest' }],
};

export const getDefaultTest = (): EpicTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_TEST;
  }
  return PROD_DEFAULT_TEST;
};
