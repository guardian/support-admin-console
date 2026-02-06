import { ResponsiveImage } from '../../../../models/shared';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../../models/studentLandingPage';
import { RegionTargeting } from '../../helpers/shared';

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
    country: '',
    locations: [],
    regionTargeting: DEFAULT_REGION_TARGETING,
    variants: [getDefaultVariant()],
    methodologies: [{ name: 'ABTest' }],
  };
};

export const getDefaultInstitution = () => {
  return {
    acronym: '',
    name: '',
    logoUrl: '',
  };
};

const DEFAULT_IMAGE: ResponsiveImage = {
  mobileUrl: '',
  tabletUrl: '',
  desktopUrl: '',
  altText: '',
};

export const getDefaultVariant = (): StudentLandingPageVariant => {
  return {
    name: 'offer',
    heading: 'Subscribe to fearless, independent and inspiring journalism',
    subheading:
      'For a limited time, students with a valid ??? email address can unlock the premium experience of Guardian journalism, including unmetered app access, free for two years.',
    institution: getDefaultInstitution(),
    promoCodes: [],
    image: DEFAULT_IMAGE,
  };
};
