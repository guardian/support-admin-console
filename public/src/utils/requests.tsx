export enum SupportFrontendSettingsType {
  switches = 'switches',
  contributionTypes = 'contribution-types',
  amounts = 'amounts'
}

export enum FrontendSettingsType {
  epicTests = 'epic-tests'
}

function fetchSettings(path: string): Promise<any> {
  return fetch(path)
    .then(resp => {
      if (!resp.ok) {
        resp.text().then(msg => alert(msg));
        throw new Error(`Could not fetch ${path} settings from server`);
      }

      return resp.json();
    });
}

function saveSettings(path: string, data: any): Promise<Response> {
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

export function requestLock(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/lock`, {
    method: 'POST'
  });
}

export function requestUnlock(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/unlock`, {
    method: 'POST'
  });
}

export function requestTakeControl(settingsType: FrontendSettingsType): Promise<Response> {
  return fetch(`/frontend/${settingsType}/takecontrol`, {
    method: 'POST'
  });
}

export function fetchSupportFrontendSettings(settingsType: SupportFrontendSettingsType): Promise<any> {
  return fetchSettings(`/support-frontend/${settingsType}`);
}

export function saveSupportFrontendSettings(settingsType: SupportFrontendSettingsType, data: any): Promise<Response> {
  return saveSettings(`/support-frontend/${settingsType}/update`, data);
}

export function fetchFrontendSettings(settingsType: FrontendSettingsType): Promise<any> {
  return fetchSettings(`/frontend/${settingsType}`);
}

export function saveFrontendSettings(settingsType: FrontendSettingsType, data: any): Promise<Response> {
  return saveSettings(`/frontend/${settingsType}/update`, data);
}
