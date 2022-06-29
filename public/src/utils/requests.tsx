import { Test, Status } from '../components/channelManagement/helpers/shared';

export enum SupportFrontendSettingsType {
  switches = 'switches',
  contributionTypes = 'contribution-types',
  amounts = 'amounts',
}

export enum FrontendSettingsType {
  headerTests = 'header-tests',
  epicTests = 'epic-tests',
  epicHoldbackTests = 'epic-holdback-tests',
  liveblogEpicTests = 'liveblog-epic-tests',
  appleNewsEpicTests = 'apple-news-epic-tests',
  ampEpicTests = 'amp-epic-tests',
  bannerTests = 'banner-tests',
  bannerTests2 = 'banner-tests2',
  bannerDeploy = 'banner-deploy',
  bannerDeploy2 = 'banner-deploy2',
  channelSwitches = 'channel-switches',
  campaigns = 'campaigns',
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

export function saveFrontendSettings(
  settingsType: FrontendSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  data: any,
): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/update`, data);
}
