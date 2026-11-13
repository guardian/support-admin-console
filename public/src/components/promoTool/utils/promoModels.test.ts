import { getPromoCountryTargeting } from './promoModels';

const countryGroups = [
  { id: 'eu', name: 'Europe', countries: ['FR', 'TR'] },
  { id: 'ukm', name: 'UK mainland', countries: ['GB'] },
];

it('stores complete legacy groups and keeps explicit countries from partial groups', () => {
  const appliesTo = { productRatePlanIds: [], countries: ['GB', 'FR'] };

  expect(getPromoCountryTargeting(appliesTo, countryGroups)).toEqual({
    groupIds: ['ukm'],
    countries: ['FR'],
  });
});

it('reads saved group IDs and retains only countries outside those groups', () => {
  const appliesTo = {
    productRatePlanIds: [],
    countryGroups: ['eu'],
    countries: ['FR', 'CA'],
  };

  expect(getPromoCountryTargeting(appliesTo, countryGroups)).toEqual({
    groupIds: ['eu'],
    countries: ['CA'],
  });
});
