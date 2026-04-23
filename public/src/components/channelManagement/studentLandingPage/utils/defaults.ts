import { identity } from 'lodash';
import { ResponsiveImage } from '../../../../models/shared';
import {
  StudentLandingPageTest,
  StudentLandingPageVariant,
} from '../../../../models/studentLandingPage';
import { RegionTargeting } from '../../helpers/shared';

export const DEFAULT_REGION_TARGETING: RegionTargeting = {
  targetedCountryGroups: [],
  targetedCountryCodes: [],
};

export const getDefaultTest = (): StudentLandingPageTest => {
  return {
    name: '',
    nickname: '',
    status: 'Draft',
    countryGroupId: '',
    locations: [],
    regionTargeting: DEFAULT_REGION_TARGETING, // unused but required
    variants: [getDefaultVariant()],
    methodologies: [{ name: 'ABTest' }],
  };
};

export const getDefaultInstitution = () => {
  return {
    identifier: '',
    acronym: '',
    name: '',
    logoUrl: '',
  };
};

const DEFAULT_IMAGE: ResponsiveImage = {
  mobileUrl:
    'https://i.guim.co.uk/img/media/811f456e9786d119d766e55f2df821c056d415b0/0_0_2588_1276/master/2588.jpg',
  tabletUrl:
    'https://i.guim.co.uk/img/media/14e65d1ade49300434e31603dd5b43e25e98e6c2/0_0_1396_1632/master/1396.jpg',
  desktopUrl:
    'https://i.guim.co.uk/img/media/f58d5cf9b591f4ddb4ad7a4b9c7bd12ae80dd333/0_0_2295_1632/master/2295.jpg',
  altText: 'The Guardian and Feast Apps',
};

export const getDefaultVariant = (): StudentLandingPageVariant => {
  return {
    name: 'offer',
    heading: 'Subscribe to fearless, independent and inspiring journalism',
    subheading:
      'For a limited time, students with a valid ??? email address can unlock the premium experience of Guardian journalism, including unmetered app access',
    institution: getDefaultInstitution(),
    promoCodes: [],
    image: DEFAULT_IMAGE,
  };
};
