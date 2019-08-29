export enum ContributionType {
  ONE_OFF = 'ONE_OFF',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL'
}

export enum Region {
  AUDCountries = 'Australia',
  Canada = 'Canada',
  EURCountries = 'Europe',
  NZDCountries = 'New Zealand',
  GBPCountries = 'United Kingdom',
  UnitedStates = 'United States',
  International = 'International',
}

export function isRegion(s: string): s is Region {
  return Object.values(Region).includes(s as Region)
}

export function isContributionType(s: string): s is ContributionType {
  return Object.values(ContributionType).includes(s as ContributionType)
}
