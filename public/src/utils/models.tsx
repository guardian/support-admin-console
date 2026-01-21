export interface CommonStringObject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

// This object does *not* match the `countryNames` object in the `support-dotcom-components` repo
// This list is purely used for displaying the country names in the amounts page on the RRCP
// It should not be used for customising reader messages
export const countries: CommonStringObject = {
  AD: 'Andorra',
  AE: 'the UAE',
  AF: 'Afghanistan',
  AG: 'Antigua and Barbuda',
  AI: 'Anguilla',
  AL: 'Albania',
  AM: 'Armenia',
  AO: 'Angola',
  AQ: 'Antarctica',
  AR: 'Argentina',
  AS: 'American Samoa',
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
  CC: 'the Cocos (Keeling) Islands',
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
  FK: 'the Falkland Islands',
  FM: 'the Federated States of Micronesia',
  FO: 'the Faroe Islands',
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
  GS: 'South Georgia and the South Sandwich Islands',
  GT: 'Guatemala',
  GU: 'Guam',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HK: 'Hong Kong',
  HM: 'Heard Island and McDonald Islands',
  HN: 'Honduras',
  HR: 'Croatia',
  HT: 'Haiti',
  HU: 'Hungary',
  ID: 'Indonesia',
  IE: 'Ireland',
  IL: 'Israel',
  IM: 'the Isle of Man',
  IN: 'India',
  IO: 'the British Indian Ocean Territory',
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
  KM: 'the Comoros',
  KN: 'Saint Kitts and Nevis',
  KP: "the Democratic People's Republic of Korea",
  KR: 'the Republic of Korea',
  KW: 'Kuwait',
  KY: 'the Cayman Islands',
  KZ: 'Kazakhstan',
  LA: "the Lao People's Democratic Republic",
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
  MF: 'Saint Martin (French part)',
  MG: 'Madagascar',
  MH: 'the Marshall Islands',
  MK: 'the Republic of North Macedonia',
  ML: 'Mali',
  MM: 'Myanmar',
  MN: 'Mongolia',
  MO: 'Macao',
  MP: 'the Northern Mariana Islands',
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
  PH: 'the Phillipines',
  PK: 'Pakistan',
  PL: 'Poland',
  PM: 'Saint Pierre and Miquelon',
  PN: 'Pitcairn',
  PR: 'Puerto Rico',
  PS: 'Palestine',
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
  SX: 'Sint Maarten',
  SY: 'Syrian Arab Republic',
  SZ: 'Eswatini',
  TC: 'Turks and Caicos Islands',
  TD: 'Chad',
  TF: 'the French Southern Territories',
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
  UA: 'Ukraine',
  UG: 'Uganda',
  UM: 'the United States Minor Outlying Islands',
  US: 'the US',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VA: 'the Holy See (Vatican City State)',
  VC: 'Saint Vincent and the Grenadines',
  VE: 'Venezuela',
  VG: 'the Virgin Islands (British)',
  VI: 'the Virgin Islands (U.S.)',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in ContributionType]: AmountValuesObject;
};

export interface AmountsVariant {
  variantName: string;
  defaultContributionType: ContributionType;
  displayContributionType: ContributionType[];
  amountsCardData: AmountsCardData;
}

/*
An amounts test can be in one of two forms:

Country test:
  Bespoke tests targeted at one or more geographical countries
  `targeting` object will include a `countries` attribute
    - a String array containing 2-letter ISO country codes
  When the `isLive` boolean is `false`:
    - the test is ignored; users will see their appropriate region test
  When the `isLive` boolean is `true`:
    - users will be randomly segregated into an AB test and see the appropriate variant
    - analytics will use the `liveTestName` label, if available, else the `testName` label
  A country can appear in more than one country test:
    - if 2+ live tests include the country, the test with the lowest `order` value will display

Region test:
  Evergreen tests, one per geographical region
  `targeting` object will include a `region` attribute
    - the region label, as defined by the Region type
  When the `isLive` boolean is `false`:
    - the CONTROL variant will display
    - analytics will use the `testName` label
  When the `isLive` boolean is `true`:
    - users will be randomly segregated into an AB test and see the appropriate variant
    - analytics will use the `liveTestName` label
*/
export type AmountsTestTargeting =
  | { targetingType: 'Region'; region: Region }
  | { targetingType: 'Country'; countries: Country[] };

export interface AmountsTest {
  testName: string;
  liveTestName?: string;
  testLabel?: string;
  isLive: boolean;
  targeting: AmountsTestTargeting;
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
