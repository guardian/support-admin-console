import { RegionTargeting } from '../../helpers/shared';
import { getStage } from '../../../../utils/stage';
import {
  SupportLandingPageTest,
  SupportLandingPageVariant,
} from '../../../../models/supportLandingPage';

const DEV_AND_CODE_DEFAULT_VARIANT: SupportLandingPageVariant = {
  name: 'CONTROL',
  copy: {
    heading: 'Support fearless, independent journalism',
    subheading:
      'We’re not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>',
  },
};

const PROD_DEFAULT_VARIANT: SupportLandingPageVariant = {
  name: 'CONTROL',
  copy: {
    heading: 'Support fearless, independent journalism',
    subheading:
      'We’re not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>',
  },
};

export const getDefaultVariant = (): SupportLandingPageVariant => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_VARIANT;
  }
  return PROD_DEFAULT_VARIANT;
};

export const DEFAULT_REGION_TARGETING: RegionTargeting = {
  targetedCountryGroups: [],
  targetedCountryCodes: [],
};

const DEV_AND_CODE_DEFAULT_LANDING_PAGE_TEST: SupportLandingPageTest = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  methodologies: [{ name: 'ABTest' }],
};

const PROD_DEFAULT_LANDING_PAGE: SupportLandingPageTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [],
  methodologies: [{ name: 'ABTest' }],
};

export const getDefaultTest = (): SupportLandingPageTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_LANDING_PAGE_TEST;
  }
  return PROD_DEFAULT_LANDING_PAGE;
};
