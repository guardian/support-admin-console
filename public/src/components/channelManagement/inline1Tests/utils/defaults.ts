import { Inline1Test, Inline1Variant } from '../../../../models/inline1';
import { MaxViews } from '../../../../models/shared';
import { stringToHexColour } from '../../../../utils/bannerDesigns';
import { DEFAULT_REGION_TARGETING } from '../../epicTests/utils/defaults';
import { UserCohort } from '../../helpers/shared';

export const DEFAULT_MAX_INLINE1_VIEWS: MaxViews = {
  maxViewsCount: 4,
  maxViewsDays: 30,
  minDaysBetweenViews: 0,
};

export const getDefaultInline1SupportMessage = (): Inline1Variant['message'] => ({
  type: 'Inline1SupportMessage',
  heading: '',
  body: '',
  primaryCta: {
    text: 'Support us',
    baseUrl: 'https://support.theguardian.com',
  },
  design: {
    style: 'business-as-usual',
    colourTheme: 'support-default',
    colours: {
      basic: {
        background: stringToHexColour('#F1F8FC'),
        headerText: stringToHexColour('#052962'),
        logo: stringToHexColour('#000000'),
        bodyText: stringToHexColour('#000000'),
        articleCountText: stringToHexColour('#000000'),
      },
      primaryCta: {
        default: {
          text: stringToHexColour('#FFE500'),
          background: stringToHexColour('#052962'),
        },
      },
    },
  },
});

export const getDefaultInline1NewsletterMessage = (): Inline1Variant['message'] => ({
  type: 'Inline1NewsletterMessage',
  newsletterId: '',
  heading: '',
  body: '',
});

export const getDefaultVariant = (): Inline1Variant => ({
  name: 'CONTROL',
  message: getDefaultInline1SupportMessage(),
  bidScore: 0,
});

export const getDefaultTest = (): Inline1Test => ({
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  variants: [getDefaultVariant()],
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
  alwaysAsk: false,
  useLocalViewLog: false,
  maxViews: DEFAULT_MAX_INLINE1_VIEWS,
});
