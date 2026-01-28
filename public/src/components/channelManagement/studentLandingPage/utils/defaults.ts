import { ChoiceCardsSettings } from '../../../../models/choiceCards';
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

export const getDefaultInstitution = () => {
  return {
    acronym: 'UTS',
    name: '',
    logoUrl: '',
  };
};

export const getDefaultChoiceCardSetting = (): ChoiceCardsSettings => {
  return {
    choiceCards: [
      {
        product: { supportTier: 'DigitalSubscription', ratePlan: 'Monthly' },
        label: 'Label',
        benefitsLabel: 'Benefits Label', // e.g. "Unlock All-access digital benefits:"
        benefits: [{ copy: 'Benefit 1' }],
        pill: {
          copy: 'pill copy', // e.g. "Recommended", will be overridden if a promo applies
        },
        isDefault: true,
        destination: 'Checkout',
      },
    ],
  };
};

export const getDefaultVariant = (): StudentLandingPageVariant => {
  return {
    name: 'offer',
    heading: 'Subscribe to fearless, independent and inspiring journalism',
    subheading:
      'For a limited time, students with a valid ??? email address can unlock the premium experience of Guardian journalism, including unmetered app access, free for two years.',
    institution: getDefaultInstitution(),
    promoCodes: [],
    choiceCardsSettings: getDefaultChoiceCardSetting(),
  };
};
