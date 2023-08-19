export interface CommonStringObject {
  [index: string]: string;
}

// This type should match the `ContributionFrequency` type in the `support-dotcom-components` repo, file `packages/shared/src/types/epic.ts`
// export type ContributionType = 'ONE_OFF' | 'MONTHLY' | 'ANNUAL';

export const contributionTypes: CommonStringObject = {
  ONE_OFF: 'ONE_OFF',
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const contributionIds = Object.keys(contributionTypes);

export type ContributionType = keyof typeof contributionTypes;

// This object should match the `CountryGroupId` type in the `support-dotcom-components` repo, file `packages/shared/src/lib/geolocation.ts`
export const regions: CommonStringObject = {
  AUDCountries: 'AUD Countries',
  Canada: 'CN Countries',
  EURCountries: 'EUR Countries',
  NZDCountries: 'NZD Countries',
  GBPCountries: 'GBP Countries',
  UnitedStates: 'United States',
  International: 'International',
};

export const regionIds = Object.keys(regions);

export type Region = keyof typeof regions;

export type RegionsAndAll = Region | 'ALL';

// This object should match the `countryNames` object in the `support-dotcom-components` repo, file `packages/shared/src/lib/geolocation.ts`
export const countries: CommonStringObject = {
  AD: 'Andorra',
  AE: 'the UAE',
  AF: 'Afghanistan',
  AG: 'Antigua and Barbuda',
  AI: 'Anguilla',
  AL: 'Albania',
  AM: 'Armenia',
  AO: 'Angola',
  AR: 'Argentina',
  AS: 'the US',
  AT: 'Austria',
  AU: 'Australia',
  AW: 'Aruba',
  AX: 'Åland Islands',
  AZ: 'Azerbaijan',
  BA: 'Bosnia and Herzegovina',
  BB: 'Barbados',
  BD: 'Bangladesh',
  BE: 'Belgium',
  BF: 'Burkina Faso',
  BG: 'Bulgaria',
  BH: 'Bahrain',
  BI: 'Burundi',
  BJ: 'Benin',
  BL: 'Saint Barthélemy',
  BM: 'Bermuda',
  BN: 'Brunei Darussalam',
  BO: 'Bolivia',
  BQ: 'Bonaire, Sint Eustatius and Saba',
  BR: 'Brazil',
  BS: 'the Bahamas',
  BT: 'Bhutan',
  BV: 'Bouvet Island',
  BW: 'Botswana',
  BY: 'Belarus',
  BZ: 'Belize',
  CA: 'Canada',
  CD: 'the Democratic Republic of the Congo',
  CF: 'the Central Africa Republic',
  CG: 'the Congo',
  CH: 'Switzerland',
  CI: "Côte d'Ivoire",
  CK: 'the Cook Islands',
  CL: 'Chile',
  CM: 'Cameroon',
  CN: 'China',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  CV: 'Cabo Verde',
  CW: 'Curaçao',
  CX: 'Christmas Island',
  CY: 'Cyprus',
  CZ: 'the Czech Republic',
  DE: 'Germany',
  DJ: 'Djibouti',
  DK: 'Denmark',
  DM: 'Dominica',
  DO: 'the Dominican Republic',
  DZ: 'Algeria',
  EC: 'Ecuador',
  EE: 'Estonia',
  EG: 'Egypt',
  EH: 'the Western Sahara',
  ER: 'Eritrea',
  ES: 'Spain',
  ET: 'Ethiopia',
  FI: 'Finland',
  FJ: 'Fiji',
  FK: 'the UK',
  FO: 'the UK',
  FR: 'France',
  GA: 'Gabon',
  GB: 'the UK',
  GD: 'Grenada',
  GE: 'Georgia',
  GF: 'French Guiana',
  GG: 'Guernsey',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GL: 'Greenland',
  GM: 'the Gambia',
  GN: 'Guinea',
  GP: 'Guadeloupe',
  GQ: 'Equatorial Guinea',
  GR: 'Greece',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HK: 'Hong Kong',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  ID: 'Indonesia',
  IE: 'Ireland',
  IM: 'the Isle of Man',
  IN: 'India',
  IQ: 'Iraq',
  IR: 'Iran',
  IS: 'Iceland',
  IT: 'Italy',
  JE: 'Jersey',
  JM: 'Jamaica',
  JO: 'Jordan',
  JP: 'Japan',
  KE: 'Kenya',
  KG: 'Kyrgyzstan',
  KH: 'Cambodia',
  KI: 'Kiribati',
  KN: 'Saint Kitts and Nevis',
  KP: 'Korea',
  KR: 'Korea',
  KW: 'Kuwait',
  KY: 'the Cayman Ialnds',
  KZ: 'Kazakhstan',
  LB: 'Lebanon',
  LC: 'Saint Lucia',
  LI: 'Liechtenstein',
  LK: 'Sri Lanka',
  LR: 'Liberia',
  LS: 'Lesotho',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  LV: 'Latvia',
  LY: 'Libya',
  MA: 'Morocco',
  MC: 'Monaco',
  MD: 'Moldova',
  ME: 'Montenegro',
  MG: 'Madagascar',
  MK: 'the Republic of North Macedonia',
  ML: 'Mali',
  MM: 'Myanmar',
  MN: 'Mongolia',
  MO: 'Macao',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MS: 'Montserrat',
  MT: 'Malta',
  MU: 'Mauritius',
  MV: 'Maldives',
  MW: 'Malawi',
  MX: 'Mexico',
  MY: 'Malaysia',
  MZ: 'Mozambique',
  NA: 'Namibia',
  NC: 'New Caledonia',
  NE: 'Niger',
  NF: 'Norfolk Island',
  NG: 'Nigeria',
  NI: 'Nicaragua',
  NL: 'the Netherlands',
  NO: 'Norway',
  NP: 'Nepal',
  NR: 'Nauru',
  NU: 'Niue',
  NZ: 'New Zealand',
  OM: 'Oman',
  PA: 'Panama',
  PE: 'Peru',
  PF: 'French Polynesia',
  PG: 'Papua New Guinea',
  PH: 'the Phillipines ',
  PK: 'Pakistan',
  PL: 'Poland',
  PM: 'Saint Pierre and Miquelon',
  PN: 'Pitcairn',
  PR: 'Puerto Rico',
  PT: 'Portugal',
  PW: 'Palau',
  PY: 'Paraguay',
  QA: 'Qatar',
  RE: 'Réunion',
  RO: 'Romania',
  RS: 'Serbia',
  RU: 'Russia',
  RW: 'Rwanda',
  SA: 'Saudi Arabia',
  SB: 'Solomon Islands',
  SC: 'Seychelles',
  SD: 'Sudan',
  SE: 'Sweden',
  SG: 'Singapore',
  SH: 'Saint Helena',
  SI: 'Slovenia',
  SJ: 'Svalbard and Jan Mayen',
  SK: 'Slovakia',
  SL: 'Sierra Leone',
  SM: 'San Marino',
  SN: 'Senegal',
  SO: 'Somalia',
  SR: 'Suriname',
  SS: 'South Sudan',
  ST: 'Sao Tome and Principe',
  SV: 'El Salvador',
  SY: 'Syrian Arab Republic',
  SZ: 'Eswatini',
  TD: 'Chad',
  TG: 'Togo',
  TH: 'Thailand',
  TJ: 'Tajikistan',
  TK: 'Tokelau',
  TL: 'Timor-Leste',
  TM: 'Turkmenistan',
  TN: 'Tunisia',
  TO: 'Tonga',
  TR: 'Turkey',
  TT: 'Trinidad and Tobago',
  TV: 'Tuvalu',
  TW: 'Taiwan',
  TZ: 'Tanzania ',
  UG: 'Uganda',
  US: 'the US',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VC: 'Saint Vincent and the Grenadines',
  VE: 'Venezuela',
  VG: 'the Virgin Islands',
  VI: 'the Virgin Islands',
  VN: 'Vietnam',
  VU: 'Vanuatu',
  WF: 'Wallis and Futuna',
  WS: 'Samoa',
  YE: 'Yemen',
  YT: 'Mayotte',
  ZA: 'South Africa',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};

export type Country = keyof typeof countries;

export interface AmountValuesObject {
  amounts: number[];
  defaultAmount: number;
  hideChooseYourAmount: boolean;
}

export type AmountsCardData = {
  [key in ContributionType]: AmountValuesObject;
};

export interface AmountsVariant {
  variantName: string;
  defaultContributionType: ContributionType;
  displayContributionType: ContributionType[];
  amountsCardData: AmountsCardData;
}

export interface AmountsTest {
  testName: string;
  liveTestName?: string;
  testLabel?: string;
  isLive: boolean;
  region: Region | '';
  country: Country[];
  order: number;
  seed: number;
  variants: AmountsVariant[];
}

export type AmountsTests = AmountsTest[];

export interface SelectedAmountsVariant extends AmountsVariant {
  testName: string;
}
export const mockAmountsCardData: SelectedAmountsVariant = {
  testName: 'amounts_test',
  variantName: 'control',
  defaultContributionType: 'MONTHLY',
  displayContributionType: ['ANNUAL', 'MONTHLY', 'ONE_OFF'],
  amountsCardData: {
    ONE_OFF: {
      amounts: [2, 5, 10, 20],
      defaultAmount: 10,
      hideChooseYourAmount: false,
    },
    MONTHLY: {
      amounts: [5, 10, 15, 20],
      defaultAmount: 10,
      hideChooseYourAmount: false,
    },
    ANNUAL: {
      amounts: [50, 100, 150, 200],
      defaultAmount: 100,
      hideChooseYourAmount: false,
    },
  },
};
