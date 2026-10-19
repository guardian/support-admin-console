import { Inline1Test, Inline1Variant } from '../../../../models/inline1';
import { DEFAULT_REGION_TARGETING } from '../../epicTests/utils/defaults';
import { UserCohort } from '../../helpers/shared';

export const getDefaultVariant = (): Inline1Variant => ({
  name: 'CONTROL',
  message: {
    type: 'Inline1SupportMessage',
    heading: '',
    body: '',
    primaryCta: {
      text: 'Support us',
      baseUrl: 'https://support.theguardian.com',
    },
  },
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
});
