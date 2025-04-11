import { Test, Status } from '../components/channelManagement/helpers/shared';
import { Campaign } from '../components/channelManagement/campaigns/CampaignsForm';
import { BannerDesign, Status as BannerDesignStatus } from '../models/bannerDesign';

export enum SupportFrontendSettingsType {
  switches = 'switches',
  contributionTypes = 'contribution-types',
  amounts = 'amounts',
  defaultPromos = 'default-promos',
}

export enum FrontendSettingsType {
  headerTests = 'header-tests',
  epicTests = 'epic-tests',
  liveblogEpicTests = 'liveblog-epic-tests',
  appleNewsEpicTests = 'apple-news-epic-tests',
  ampEpicTests = 'amp-epic-tests',
  bannerTests = 'banner-tests',
  bannerTests2 = 'banner-tests2',
  bannerDeploy = 'banner-deploy',
  bannerDeploy2 = 'banner-deploy2',
  gutterLiveblogTests = 'gutter-liveblog-tests',
  channelSwitches = 'channel-switches',
  campaigns = 'campaigns',
  bannerDesigns = 'banner-designs',
  supportLandingPageTests = 'support-landing-page-tests',
  threeTierChoiceCards = 'three-tier-choice-cards',
}

export enum AppsSettingsType {
  appsMeteringSwitches = 'apps-metering-switches',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeFetch(path: string, options?: RequestInit): Promise<any> {
  return fetch(path, options).then(resp => {
    if (!resp.ok) {
      return resp.text().then(msg => Promise.reject(new Error(msg)));
    }

    return resp;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fetchSettings(path: string): Promise<any> {
  return makeFetch(path).then(resp => resp.json());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveSettings(path: string, data: any): Promise<Response> {
  return makeFetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function saveTestListOrder(
  settingsType: FrontendSettingsType,
  testNames: string[],
): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/list/reorder`, testNames);
}

export function fetchTest<T>(settingsType: FrontendSettingsType, testName: string): Promise<T> {
  return fetchSettings(`/frontend/${settingsType}/test/${testName}`);
}

export function lockTest(
  settingsType: FrontendSettingsType,
  testName: string,
  force: boolean,
): Promise<Response> {
  const path = force
    ? `/frontend/${settingsType}/test/takecontrol/${testName}`
    : `/frontend/${settingsType}/test/lock/${testName}`;
  return makeFetch(path, {
    method: 'POST',
  });
}
export function unlockTest(
  settingsType: FrontendSettingsType,
  testName: string,
): Promise<Response> {
  return makeFetch(`/frontend/${settingsType}/test/unlock/${testName}`, {
    method: 'POST',
  });
}
export function updateTest<T>(settingsType: FrontendSettingsType, test: T): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/update`, test);
}
export function createTest<T>(settingsType: FrontendSettingsType, test: T): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/create`, test);
}

export function sendCreateCampaignRequest(campaign: Campaign): Promise<Response> {
  return saveSettings(`/frontend/campaigns/create`, campaign);
}

export function sendUpdateCampaignRequest(campaign: Campaign): Promise<Response> {
  return saveSettings(`/frontend/campaigns/update`, campaign);
}

export function updateStatuses(
  settingsType: FrontendSettingsType,
  testNames: string[],
  status: Status,
): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/status/${status}`, testNames);
}
export function requestTestListLock(settingsType: FrontendSettingsType): Promise<Response> {
  return makeFetch(`/frontend/${settingsType}/list/lock`, {
    method: 'POST',
  });
}

export function requestTestListTakeControl(settingsType: FrontendSettingsType): Promise<Response> {
  return makeFetch(`/frontend/${settingsType}/list/takecontrol`, {
    method: 'POST',
  });
}

export function fetchSupportFrontendSettings(
  settingsType: SupportFrontendSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return fetchSettings(`/support-frontend/${settingsType}`);
}

export function fetchCampaignTests(campaign: string): Promise<Test[]> {
  return fetchSettings(`/frontend/campaign/${campaign}/tests`);
}

export function saveSupportFrontendSettings(
  settingsType: SupportFrontendSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  data: any,
): Promise<Response> {
  return saveSettings(`/support-frontend/${settingsType}/update`, data);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fetchFrontendSettings(settingsType: FrontendSettingsType): Promise<any> {
  return fetchSettings(`/frontend/${settingsType}`);
}

export interface BannerDesignsResponse {
  bannerDesigns: BannerDesign[];
  userEmail: string;
}

export function fetchBannerDesign(designName: string): Promise<BannerDesign> {
  return fetchSettings(`/frontend/${FrontendSettingsType.bannerDesigns}/${designName}`);
}

export function lockBannerDesign(designName: string, force: boolean): Promise<Response> {
  const path = force
    ? `/frontend/${FrontendSettingsType.bannerDesigns}/takecontrol/${designName}`
    : `/frontend/${FrontendSettingsType.bannerDesigns}/lock/${designName}`;
  return makeFetch(path, {
    method: 'POST',
  });
}

export function unlockBannerDesign(designName: string): Promise<Response> {
  return makeFetch(`/frontend/${FrontendSettingsType.bannerDesigns}/unlock/${designName}`, {
    method: 'POST',
  });
}

export function updateBannerDesign(design: BannerDesign): Promise<Response> {
  return saveSettings(`/frontend/${FrontendSettingsType.bannerDesigns}/update`, design);
}

export function createBannerDesign(design: BannerDesign): Promise<Response> {
  return saveSettings(`/frontend/${FrontendSettingsType.bannerDesigns}/create`, design);
}

export function updateBannerDesignStatus(
  designName: string,
  status: BannerDesignStatus,
): Promise<Response> {
  return makeFetch(
    `/frontend/${FrontendSettingsType.bannerDesigns}/status/${designName}/${status}`,
    {
      method: 'POST',
    },
  );
}

export function archiveBannerDesign(designName: string): Promise<Response> {
  return makeFetch(`/frontend/${FrontendSettingsType.bannerDesigns}/archive/${designName}`, {
    method: 'POST',
  });
}

export function getBannerDesignUsage(
  designName: string,
): Promise<{ name: string; channel: string }[]> {
  return fetchSettings(`/frontend/${FrontendSettingsType.bannerDesigns}/usage/${designName}`);
}

export function saveFrontendSettings(
  settingsType: FrontendSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  data: any,
): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/update`, data);
}

export function fetchAppsSettings<T>(settingsType: AppsSettingsType): Promise<T> {
  return fetchSettings(`/apps/${settingsType}`);
}

export function saveAppsSettings<T>(settingsType: AppsSettingsType, data: T): Promise<Response> {
  return saveSettings(`/apps/${settingsType}/update`, data);
}
