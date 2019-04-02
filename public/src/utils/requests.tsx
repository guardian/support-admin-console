
export enum SettingsType {
  switches = 'switches',
  contributionTypes = 'contributionTypes',
  amounts = 'amounts'
}

export function fetchSettings(settingsType: SettingsType): Promise<any> {
  return fetch(`/support-frontend/${settingsType}`)
    .then(resp => {
      if (!resp.ok) {
        resp.text().then(msg => alert(msg));
        throw new Error(`Could not fetch ${settingsType} settings from server`);
      }

      return resp.json();
    });
}

export function saveSettings(settingsType: SettingsType, data: any): Promise<Response> {
  return fetch(`/support-frontend/${settingsType}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}
