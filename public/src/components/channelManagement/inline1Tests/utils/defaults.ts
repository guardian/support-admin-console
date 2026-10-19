import { Inline1Test, Inline1Variant } from '../../../../models/inline1';
import { DEFAULT_REGION_TARGETING } from '../../epicTests/utils/defaults';
import { UserCohort } from '../../helpers/shared';

export const getDefaultInline1SupportMessage = (): Inline1Variant['message'] => ({
  type: 'Inline1SupportMessage',
  heading: '',
  body: '',
  primaryCta: {
    text: 'Support us',
    baseUrl: 'https://support.theguardian.com',
  },
});

export const getDefaultInline1NewsletterMessage = (): Inline1Variant['message'] => ({
  type: 'Inline1NewsletterMessage',
  newsletterId: '',
  frequency: '',
  heading: '',
  body: '',
});

export const getDefaultVariant = (): Inline1Variant => ({
  name: 'CONTROL',
  message: getDefaultInline1SupportMessage(),
});

export const getDefaultTest = (): Inline1Test => ({
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: DEFAULT_REGION_TARGETING,
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  message: getDefaultInline1SupportMessage(),
  variants: [getDefaultVariant()],
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
});
