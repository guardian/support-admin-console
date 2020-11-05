import { Test } from '../components/channelManagement/helpers/shared';

export enum SupportFrontendSettingsType {
  switches = 'switches',
  contributionTypes = 'contribution-types',
  amounts = 'amounts',
}

export enum FrontendSettingsType {
  epicTests = 'epic-tests',
  liveblogEpicTests = 'liveblog-epic-tests',
  appleNewsEpicTests = 'apple-news-epic-tests',
  ampEpicTests = 'amp-epic-tests',
  bannerTests = 'banner-tests',
  bannerTests2 = 'banner-tests2',
  bannerDeploy = 'banner-deploy',
  bannerDeploy2 = 'banner-deploy2',
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/update`, data);
}

export function archiveTest(test: Test, settingsType: FrontendSettingsType): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/archive`, test);
}
