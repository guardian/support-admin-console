import { GutterTest, GutterVariant } from '../../../../models/gutter';
import { getStage } from '../../../../utils/stage';
import { Cta, RegionTargeting, UserCohort } from '../../helpers/shared';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support us',
  baseUrl: 'https://support.theguardian.com/contribute',
};

export const DEFAULT_IMAGE_URL = 'https://uploads.guim.co.uk/2025/06/12/not_for_sale_bg_scaled.svg';
export const DEFAULT_IMAGE_ALT = 'Not for Sale';

const DEV_AND_CODE_DEFAULT_VARIANT: GutterVariant = {
  content: {
    image: {
      mainUrl: DEFAULT_IMAGE_URL,
      altText: DEFAULT_IMAGE_ALT,
    },
    bodyCopy: [
      'The Guardian’s expert news coverage is funded by people like you, not a billionaire owner. Will you help us keep our independent journalism free and open to all today?',
    ],
    cta: DEFAULT_PRIMARY_CTA,
  },
  name: 'CONTROL',
};

const PROD_DEFAULT_VARIANT: GutterVariant = {
  content: {
    image: {
      mainUrl: DEFAULT_IMAGE_URL,
      altText: DEFAULT_IMAGE_ALT,
    },
    bodyCopy: [
      'The Guardian’s expert news coverage is funded by people like you, not a billionaire owner. Will you help us keep our independent journalism free and open to all today?',
    ],
    cta: DEFAULT_PRIMARY_CTA,
  },
  name: 'CONTROL',
};

export const getDefaultVariant = (): GutterVariant => {
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

const DEV_AND_CODE_DEFAULT_GUTTER_TEST: GutterTest = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
  deviceType: 'Desktop',
};

const PROD_DEFAULT_GUTTER_TEST: GutterTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [PROD_DEFAULT_VARIANT],
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
  deviceType: 'Desktop',
};

export const getDefaultTest = (): GutterTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_GUTTER_TEST;
  }
  return PROD_DEFAULT_GUTTER_TEST;
};
