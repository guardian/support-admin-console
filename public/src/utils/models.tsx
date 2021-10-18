export enum ContributionType {
  ONE_OFF = 'ONE_OFF',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export enum Region {
  AUDCountries = 'AUDCountries',
  Canada = 'Canada',
  EURCountries = 'EURCountries',
  NZDCountries = 'NZDCountries',
  GBPCountries = 'GBPCountries',
  UnitedStates = 'UnitedStates',
  International = 'International',
}

export type RegionsAndAll = Region | 'ALL';

export function isRegion(s: string): s is Region {
  return Object.values(Region).includes(s as Region);
}

export function isContributionType(s: string): s is ContributionType {
  return Object.values(ContributionType).includes(s as ContributionType);
}

const REGION_TO_PRETTIFIED_NAME = {
  GBPCountries: 'GBP Countries',
  UnitedStates: 'United States',
  AUDCountries: 'AUD Countries',
  NZDCountries: 'NZD Countries',
  EURCountries: 'EUR Countries',
  Canada: 'CN Countries',
  International: 'International',
};

export function getPrettifiedRegionName(region: Region): string {
  return REGION_TO_PRETTIFIED_NAME[region];
}
