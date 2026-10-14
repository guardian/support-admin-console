import { Inline1Test, Inline1Variant } from '../../../models/inline1';
import { UserCohort } from '../helpers/shared';

export const getDefaultVariant = (): Inline1Variant => ({
  name: 'CONTROL',
});

export const getDefaultTest = (): Inline1Test => ({
  name: '',
  nickname: '',
  status: 'Draft',
  userCohort: UserCohort.AllNonSupporters,
  locations: [],
  regionTargeting: {
    targetedCountryGroups: [],
    targetedCountryCodes: [],
    contributionsOnlyCountriesTargeting: 'Exclude',
  },
  variants: [getDefaultVariant()],
  methodologies: [{ name: 'ABTest' }],
  campaignName: '',
});
