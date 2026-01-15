import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../../models/studentLandingPage';
import { RegionTargeting, UserCohort } from '../../helpers/shared';

// TODO: check if these are correct for this application

export const DEFAULT_REGION_TARGETING: RegionTargeting = {
  targetedCountryGroups: [],
  targetedCountryCodes: [],
};

export const getDefaultTest = (): StudentLandingPageTest => {
  return {
    name: '',
    nickname: '',
    status: 'Draft',
    userCohort: UserCohort.AllNonSupporters,
    locations: [],
    regionTargeting: DEFAULT_REGION_TARGETING,
    variants: [getDefaultVariant()],
    articlesViewedSettings: undefined,
    contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
    methodologies: [{ name: 'ABTest' }],
  };
};

export const getDefaultVariant = (): StudentLandingPageVariant => {
  return {
    name: 'offer',
    heading: '',
    subheading: '',
  };
};
