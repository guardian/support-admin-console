import { Cta, UserCohort } from '../../helpers/shared';
import { HeadTest, HeadVariant } from '../../../../models/head';

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
  content: {
    heading: 'Lorem Ipsum',
    subheading: 'Exam desut lineas buteram loas',
    primaryCta: DEFAULT_PRIMARY_CTA,
  },
};

const PROD_DEFAULT_VARIANT: HeadVariant = {
  name: 'CONTROL',
  content: {
    heading: 'Lorem Ipsum Prod',
    subheading: 'Exam desut lineas buteram loas Prod',
    primaryCta: DEFAULT_PRIMARY_CTA,
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
  name: '',
  nickname: '',
  isOn: false,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
};

const PROD_DEFAULT_BANNER: HeadTest = {
  name: '',
  nickname: '',
  isOn: false,
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
};

export const getDefaultTest = (): HeadTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
