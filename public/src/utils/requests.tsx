import { Test } from '../components/channelManagement/helpers/shared';

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
function fetchSettings(path: string): Promise<any> {
  return fetch(path).then(resp => {
    if (!resp.ok) {
      resp.text().then(msg => alert(msg));
      throw new Error(`Could not fetch ${path} settings from server`);
    }

    return resp.json();
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveSettings(path: string, data: any): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export function saveTestListOrder(settingsType: FrontendSettingsType, testNames: string[]): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/list/reorder`, testNames);
}

export function fetchTest(settingsType: FrontendSettingsType, testName: string): Promise<any> {
  return fetchSettings(`/frontend/${settingsType}/test/${testName}`)
}

export function lockTest(settingsType: FrontendSettingsType, testName: string, force: boolean): Promise<Response> {
  const path = force ?
    `/frontend/${settingsType}/test/takecontrol/${testName}` :
    `/frontend/${settingsType}/test/lock/${testName}`;
  return fetch(path, {
    method: 'POST',
  })
}
export function unlockTest(settingsType: FrontendSettingsType, testName: string): Promise<Response> {
  return fetch(`/frontend/${settingsType}/test/unlock/${testName}`, {
    method: 'POST',
  })
}
export function updateTest(settingsType: FrontendSettingsType, test: any): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/update`, test);
}
export function createTest(settingsType: FrontendSettingsType, test: any): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/create`, test);
}
export function archiveTests(settingsType: FrontendSettingsType, testNames: string[]): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/test/archive`, testNames);
}
export function requestLock(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/lock`, {
    method: 'POST',
  });
}

export function requestUnlock(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/unlock`, {
    method: 'POST',
  });
}

export function requestTakeControl(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/takecontrol`, {
    method: 'POST',
  });
}

export function fetchSupportFrontendSettings(
  settingsType: SupportFrontendSettingsType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  return fetchSettings(`/support-frontend/${settingsType}`);
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

export function archiveTest(test: Test, settingsType: FrontendSettingsType): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/archive`, test);
}
