export interface Campaign {
  name: string;
  nickname: string;
  description?: string;
  notes?: string[];
  isActive?: boolean;
}

export type Campaigns = Campaign[];

export interface TestChannelItem {
  name: string;
  link: string;
}

export type TestChannelData = Record<string, TestChannelItem>;

export const unassignedCampaign = {
  name: 'NOT_IN_CAMPAIGN',
  nickname: 'TESTS NOT IN A CAMPAIGN',
  description: 'Tests not assigned to a campaign',
};

export const testChannelOrder = [
  'Header',
  'Epic',
  'EpicLiveblog',
  'EpicAppleNews',
  'Banner1',
  'Banner2',
  'GutterLiveblog',
];

export const testChannelData: TestChannelData = {
  Header: {
    name: 'Header',
    link: 'header-tests',
  },
  Epic: {
    name: 'Epic',
    link: 'epic-tests',
  },
  EpicLiveblog: {
    name: 'Liveblog Epic',
    link: 'liveblog-epic-tests',
  },
  EpicAppleNews: {
    name: 'Apple News Epic',
    link: 'apple-news-epic-tests',
  },
  Banner1: {
    name: 'Banner 1',
    link: 'banner-tests',
  },
  Banner2: {
    name: 'Banner 2',
    link: 'banner-tests2',
  },
  GutterLiveblog: {
    name: 'Gutter Liveblog',
    link: 'gutter-liveblog-tests',
  },
};
