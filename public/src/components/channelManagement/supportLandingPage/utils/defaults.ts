import { RegionTargeting } from '../../helpers/shared';
import { getStage } from '../../../../utils/stage';
import {
  SupportLandingPageTest,
  SupportLandingPageVariant,
} from '../../../../models/supportLandingPage';

const defaultProducts = {
  Contribution: {
    title: 'Support',
    benefits: [
      {
        copy: 'Give to the Guardian every month with Support',
      },
    ],
    cta: { copy: 'Support' },
  },
  SupporterPlus: {
    title: 'All-access digital',
    benefits: [
      {
        copy: 'Unlimited access to the Guardian app',
        tooltip:
          'Read beyond our 20 article-per-month limit, enjoy offline access and personalised recommendations, and access our full archive of journalism. Never miss a story with the Guardian News app – a beautiful, intuitive reading experience.',
      },
      {
        copy: 'Ad-free reading on all your devices',
      },
      {
        copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
      },
      {
        copy: 'Far fewer asks for support',
        tooltip:
          "You'll see far fewer financial support asks at the bottom of articles or in pop-up banners.",
      },
      {
        copy: 'Unlimited access to the Guardian Feast app',
        tooltip:
          'Make a feast out of anything with the Guardian’s new recipe app. Feast has thousands of recipes including quick and budget-friendly weeknight dinners, and showstopping weekend dishes – plus smart app features to make mealtimes inspiring.',
        label: { copy: 'New' },
      },
    ],
    cta: {
      copy: 'Support',
    },
    label: { copy: 'Recommended' },
  },
  TierThree: {
    title: 'Digital + print',
    benefits: [
      {
        copy: 'Guardian Weekly print magazine delivered to your door every week',
        tooltip:
          'Guardian Weekly is a beautifully concise magazine featuring a handpicked selection of in-depth articles, global news, long reads, opinion and more. Delivered to you every week, wherever you are in the world.',
      },
    ],
    cta: { copy: 'Support' },
  },
  DigitalSubscription: {
    title: 'Digital plus',
    pillLabel: { copy: 'New' },
    benefits: [],
    cta: { copy: 'Support' },
  },
};

const DEV_AND_CODE_DEFAULT_VARIANT: SupportLandingPageVariant = {
  name: 'CONTROL',
  copy: {
    heading: 'Support fearless, independent journalism',
    subheading:
      'We’re not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>',
  },
  products: defaultProducts,
};

const PROD_DEFAULT_VARIANT: SupportLandingPageVariant = {
  name: 'CONTROL',
  copy: {
    heading: 'Support fearless, independent journalism',
    subheading:
      'We’re not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>',
  },
  products: defaultProducts,
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
