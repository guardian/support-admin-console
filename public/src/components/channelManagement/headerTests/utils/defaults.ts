import { Cta, UserCohort } from '../../helpers/shared';
import { HeaderTest, HeaderVariant } from '../../../../models/header';

import { getStage } from '../../../../utils/stage';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_SECONDARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const DEV_AND_CODE_DEFAULT_VARIANT: HeaderVariant = {
  name: 'CONTROL',
  content: {
    heading: 'Support the Guardian',
    subheading: 'Available for everyone, funded by readers',
    primaryCta: DEFAULT_PRIMARY_CTA,
  },
};

const PROD_DEFAULT_VARIANT: HeaderVariant = {
  name: 'CONTROL',
  content: {
    heading: 'Support the Guardian',
    subheading: 'Available for everyone, funded by readers',
    primaryCta: DEFAULT_PRIMARY_CTA,
  },
};

export const getDefaultVariant = (): HeaderVariant => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

const DEV_AND_CODE_DEFAULT_BANNER_TEST: HeaderTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
};

const PROD_DEFAULT_BANNER: HeaderTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
};

export const getDefaultTest = (): HeaderTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
