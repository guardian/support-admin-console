import { Cta, UserCohort } from '../../helpers/shared';
import { HeadTest, HeadVariant, HeadTemplate } from '../../../../models/head';

import { getStage } from '../../../../utils/stage';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_SECONDARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const DEV_AND_CODE_DEFAULT_VARIANT: HeadVariant = {
  name: 'CONTROL',
  template: HeadTemplate.ContributionsHead,
  headContent: {
    heading: 'We chose a different approach. Will you support it?',
    messageText:
      'We believe every one of us deserves to read quality, independent, fact-checked news and measured explanation – that’s why we keep Guardian journalism open to all. Our editorial independence has never been so vital. No one sets our agenda, or edits our editor, so we can keep providing independent reporting each and every day. No matter how unpredictable the future feels, we will remain with you. Every contribution, however big or small, makes our work possible – in times of crisis and beyond.',
    highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
    cta: DEFAULT_PRIMARY_CTA,
  },
};

const PROD_DEFAULT_VARIANT: HeadVariant = {
  name: 'CONTROL',
  template: HeadTemplate.ContributionsHead,
  headContent: {
    messageText: '',
    highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
    cta: DEFAULT_PRIMARY_CTA,
  },
};

export const getDefaultVariant = (): HeadVariant => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

const DEV_AND_CODE_DEFAULT_BANNER_TEST: HeadTest = {
  name: 'TEST',
  nickname: 'TEST',
  isOn: false,
  minArticlesBeforeShowingHead: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  articlesViewedSettings: undefined,
};

const PROD_DEFAULT_BANNER: HeadTest = {
  name: '',
  nickname: '',
  isOn: false,
  minArticlesBeforeShowingHead: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
  articlesViewedSettings: undefined,
};

export const getDefaultTest = (): HeadTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
