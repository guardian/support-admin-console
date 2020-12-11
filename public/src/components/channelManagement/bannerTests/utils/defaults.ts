import { UserCohort } from '../../helpers/shared';
import { BannerTest, BannerVariant, BannerTemplate } from '../../../../models/banner';

import { getStage } from '../../../../utils/stage';

const DEV_AND_CODE_DEFAULT_VARIANT: BannerVariant = {
  name: 'CONTROL',
  template: BannerTemplate.ContributionsBanner,
  heading: 'We chose a different approach. Will you support it?',
  body:
    'We believe every one of us deserves to read quality, independent, fact-checked news and measured explanation – that’s why we keep Guardian journalism open to all. Our editorial independence has never been so vital. No one sets our agenda, or edits our editor, so we can keep providing independent reporting each and every day. No matter how unpredictable the future feels, we will remain with you. Every contribution, however big or small, makes our work possible – in times of crisis and beyond.',
  highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
  cta: {
    text: 'Support the Guardian',
    baseUrl: 'https://support.theguardian.com/contribute',
  },
};

const PROD_DEFAULT_VARIANT: BannerVariant = {
  name: 'CONTROL',
  template: BannerTemplate.ContributionsBanner,
  body: '',
  highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
  cta: {
    text: 'Support the Guardian',
    baseUrl: 'https://support.theguardian.com/contribute',
  },
};

export const getDefaultVariant = (): BannerVariant => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

const DEV_AND_CODE_DEFAULT_BANNER_TEST: BannerTest = {
  name: 'TEST',
  nickname: 'TEST',
  isOn: false,
  minArticlesBeforeShowingBanner: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  articlesViewedSettings: undefined,
};

const PROD_DEFAULT_BANNER: BannerTest = {
  name: '',
  nickname: '',
  isOn: false,
  minArticlesBeforeShowingBanner: 0,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
  articlesViewedSettings: undefined,
};

export const getDefaultTest = (): BannerTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
