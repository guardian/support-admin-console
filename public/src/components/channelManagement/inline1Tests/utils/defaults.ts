import { Inline1Test, Inline1Variant } from '../../../../models/inline1';
import { UserCohort } from '../../helpers/shared';
import {DEFAULT_REGION_TARGETING} from "../../epicTests/utils/defaults";

export const getDefaultVariant = (): Inline1Variant => ({
  name: 'CONTROL',
});

export const getDefaultTest = (): Inline1Test => ({
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting:  DEFAULT_REGION_TARGETING,
  contextTargeting: { tagIds: [], sectionIds: [], excludedTagIds: [], excludedSectionIds: [] },
  variants: [getDefaultVariant()],
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
});
