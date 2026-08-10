import { HeaderTest, HeaderVariant } from '../../../../models/header';
import { getStage } from '../../../../utils/stage';
import { Cta, RegionTargeting, UserCohort } from '../../helpers/shared';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_SECONDARY_CTA: Cta = {
  text: 'Support the Guardian',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const CODE_DEFAULT_VARIANT: HeaderVariant = {
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
  if (stage === 'CODE') {
    return CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

export const DEFAULT_REGION_TARGETING: RegionTargeting = {
  targetedCountryGroups: [],
  targetedCountryCodes: [],
  contributionsOnlyCountriesTargeting: 'Exclude',
};

const CODE_DEFAULT_BANNER_TEST: HeaderTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [],
  methodologies: [{ name: 'ABTest' }],
};

const PROD_DEFAULT_BANNER: HeaderTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [],
  methodologies: [{ name: 'ABTest' }],
};

export const getDefaultTest = (): HeaderTest => {
  const stage = getStage();
  if (stage === 'CODE') {
    return CODE_DEFAULT_BANNER_TEST;
  }
  return PROD_DEFAULT_BANNER;
};
