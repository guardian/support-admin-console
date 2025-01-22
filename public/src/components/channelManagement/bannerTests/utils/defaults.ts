import { Cta, UserCohort } from '../../helpers/shared';
import { BannerTest, BannerVariant } from '../../../../models/banner';

import { getStage } from '../../../../utils/stage';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_SECONDARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const DEV_AND_CODE_DEFAULT_VARIANT: BannerVariant = {
  name: 'CONTROL',
  template: { designName: 'TEST_NOT_SELECTED' },
  bannerContent: {
    heading: 'We chose a different approach. Will you support it?',
    paragraphs: [
      'We believe every one of us deserves to read quality, independent, fact-checked news and measured explanation – that’s why we keep Guardian journalism open to all. Our editorial independence has never been so vital. No one sets our agenda, or edits our editor, so we can keep providing independent reporting each and every day. No matter how unpredictable the future feels, we will remain with you. Every contribution, however big or small, makes our work possible – in times of crisis and beyond.',
    ],
    highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
    cta: DEFAULT_PRIMARY_CTA,
  },
};

const PROD_DEFAULT_VARIANT: BannerVariant = {
  name: 'CONTROL',
  template: { designName: 'TEST_NOT_SELECTED' },
  bannerContent: {
    paragraphs: [],
    highlightedText: 'Support the Guardian from as little as %%CURRENCY_SYMBOL%%1. Thank you.',
    cta: DEFAULT_PRIMARY_CTA,
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
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  targetedCountries: [],
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  articlesViewedSettings: undefined,
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
};

const PROD_DEFAULT_BANNER: BannerTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  targetedCountries: [],
  variants: [],
  articlesViewedSettings: undefined,
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
};

export const getDefaultTest = (): BannerTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
