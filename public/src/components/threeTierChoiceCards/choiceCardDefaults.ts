import {ThreeTierChoiceCards, ThreeTierChoiceCardVariant} from "../../models/threeTierChoiceCards";
import {getStage} from "../../utils/stage";
import {RegionTargeting} from "../channelManagement/helpers/shared";

const defaultGBTiers = {
  lowerTier: {
    title: 'Support £4/month:',
    benefits: {
      subheadingCopy: 'Unlock Support benefits:',
      benefitsCopy: [
        {
          copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
        },
      ],
    },
  },
  higherTier: {
    title: 'Unlock All-access digital benefits:',
    benefits: {
      subheadingCopy: 'Unlock Support benefits:',
      benefitsCopy: [
        {
          copy: 'Unlimited access to the Guardian app',
        },
        {
          copy: 'Unlimited access to our new Feast App',
        },
        {
          copy: 'Ad-free reading on all your devices',
        },
        {
          copy: 'Exclusive newsletter for supporters, sent every week from the Guardian newsroom',
        },
        {
          copy: 'Far fewer asks for support',
        },
      ],
    },
    label: {
      copy: 'Recommended',
    },
  },
  otherTier: {
    title: 'Support with another amount',
    benefits: {
      subheadingCopy: 'We welcome support of any size, any time',
    },
  },
};

const DEV_AND_CODE_DEFAULT_VARIANT: ThreeTierChoiceCardVariant = {
  name: 'CONTROL',
  tiers: defaultGBTiers,
};

const PROD_DEFAULT_VARIANT: ThreeTierChoiceCardVariant = {
  name: 'CONTROL',
  tiers: defaultGBTiers,
};

export const getDefaultVariant = (): ThreeTierChoiceCardVariant => {
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

const DEV_AND_CODE_DEFAULT_THREE_TIER_CHOICE_CARDS: ThreeTierChoiceCards = {
  name: 'TEST',
  nickname: 'TEST',
  status: 'Draft',
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  methodologies: [{ name: 'ABTest' }],
};

const PROD_DEFAULT_THREE_TIER_CHOICE_CARDS: ThreeTierChoiceCards = {
  name: '',
  nickname: '',
  status: 'Draft',
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  variants: [DEV_AND_CODE_DEFAULT_VARIANT],
  methodologies: [{ name: 'ABTest' }],
};

export const getDefaultTest = (): ThreeTierChoiceCards => {
  const stage = getStage();
  if (stage === 'DEV' || stage === 'CODE') {
    return DEV_AND_CODE_DEFAULT_THREE_TIER_CHOICE_CARDS;
  }
  return PROD_DEFAULT_THREE_TIER_CHOICE_CARDS;
};
