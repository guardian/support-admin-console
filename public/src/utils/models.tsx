interface CommonStringObject {
  [index: string]: string;
}

// This type should match the `ContributionFrequency` type in the `support-dotcom-components` repo, file `packages/shared/src/types/epic.ts`
export type ContributionType = 'ONE_OFF' | 'MONTHLY' | 'ANNUAL';

export const ContributionTypes: CommonStringObject = {
  ONE_OFF: 'ONE_OFF',
  MONTHLY: 'MONTHLY',
  ANNUAL: 'ANNUAL',
};

export const isContributionType = (val: string): boolean => {
  return Object.keys(ContributionTypes).includes(val);
};

// This type should match the `CountryGroupId` type in the `support-dotcom-components` repo, file `packages/shared/src/lib/geolocation.ts`
export const Regions: CommonStringObject = {
  AUDCountries: 'AUD Countries',
  Canada: 'CN Countries',
  EURCountries: 'EUR Countries',
  NZDCountries: 'NZD Countries',
  GBPCountries: 'GBP Countries',
  UnitedStates: 'United States',
  International: 'International',
};

// export type Region = 
//   | 'AUDCountries'
//   | 'Canada'
//   | 'EURCountries'
//   | 'NZDCountries'
//   | 'GBPCountries'
//   | 'UnitedStates'
//   | 'International';

export type Region = keyof typeof Regions;

export type RegionsAndAll = Region | 'ALL';

// This object should match the `countryNames` object in the `support-dotcom-components` repo, file `packages/shared/src/lib/geolocation.ts`
export const Countries: CommonStringObject = {
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

export type Country = keyof typeof Countries;

export type Territory = Country | Region;

export const Territories = {
  ...Regions,
  ...Countries,
};

export const isRegion = (val: string): boolean => {
  return Object.keys(Regions).includes(val);
};

export const getTargetName = (val: string): string => {
  if (isRegion(val)) {
    return Regions[val];
  }
  return Countries[val] || '';
};

export interface AmountValuesObject {
  amounts: number[];
  defaultAmount: number;
  hideChooseYourAmount?: boolean;
}

export type AmountsCardData = {
  [key in ContributionType]: AmountValuesObject;
}

export interface AmountsVariant {
  variantName: string;
  defaultContributionType?: ContributionType;
  amountsCardData: AmountsCardData;
}

export interface AmountsTest {
  testName: string;
  isLive: boolean;
  target: Region | string;
  seed: number;
  variants: AmountsVariant[];
}

export type AmountsTests = AmountsTest[];
