import { GutterTest, GutterVariant } from '../../../../models/gutter';
import { getStage } from '../../../../utils/stage';
import { Cta, UserCohort } from '../../helpers/shared';

export const DEFAULT_PRIMARY_CTA: Cta = {
  text: 'Support us',
  baseUrl: 'https://support.theguardian.com/contribute',
};

const DEFAULT_IMAGE_URL = 'https://TODO'; // upload existing SVG and add to google with uploader.

const DEV_AND_CODE_DEFAULT_VARIANT: GutterVariant = {
  gutterContent: {
    imageUrl: DEFAULT_IMAGE_URL, // should this be a URL type?
    altText: 'NOT FOR SALE', // this might be better in a new type - or perhaps one exists already.
    bodyCopy:
      'The Guardian’s expert news coverage is funded by people like you, not a billionaire owner. Will you help us keep our independent journalism free and open to all today?',
    cta: DEFAULT_PRIMARY_CTA,
  },
  name: 'CONTROL',
};

const PROD_DEFAULT_VARIANT: GutterVariant = {
  gutterContent: {
    imageUrl: DEFAULT_IMAGE_URL, // should this be a URL type?
    altText: 'NOT FOR SALE', // this might be better in a new type for image and alt - or perhaps one exists already.
    bodyCopy:
      'The Guardian’s expert news coverage is funded by people like you, not a billionaire owner. Will you help us keep our independent journalism free and open to all today?',
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

const DEV_AND_CODE_DEFAULT_GUTTER_TEST: GutterTest = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
  deviceType: 'Desktop',
};

const PROD_DEFAULT_GUTTER_TEST: GutterTest = {
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  variants: [],
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  methodologies: [{ name: 'ABTest' }],
  deviceType: 'Desktop',
};

export const getDefaultTest = (): GutterTest => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_GUTTER_TEST;
  }
  return PROD_DEFAULT_GUTTER_TEST;
};
