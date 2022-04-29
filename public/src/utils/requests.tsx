import { Test } from '../components/channelManagement/helpers/shared';
// @ts-ignore -- panda-session has no type definitions
import { reEstablishSession } from 'panda-session';

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

function postWithReauth(url: string, config: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    fetch("/isValid")
      .then(response => {
        if (response.status === 419) {
          console.log("419, need to re-establish")
          reEstablishSession('/reauth', 5000)
            .then(() => {
              console.log('re-established');
              fetch(url, config)
                .then(resolve)
                .catch(reject)
            })
            .catch(err => {
              console.log('failed to re-establish')
              reject(err)
            })
        } else {
          console.log("no need to re-establish")
          fetch(url, config)
            .then(resolve)
            .catch(reject)
        }
      })
    // fetch(url, config, redirect: 'manual'})
    //   .then(response => {
    //     console.log('response', response);
    //
    //     if (response.status === 0) {
    //       fetch('reauth').then(() => {
    //         console.log('re-established');
    //         fetch(url, config)
    //           .then(response => {
    //             console.log('made the fetch after re-establish');
    //             return response;
    //           })
    //           .then(resolve)
    //           .catch(reject);
    //       })
    //     } else {
    //       resolve(response);
    //     }
        // if (response.status === 419) {
        //   // session has expired, reauth
        //   console.log('doing reauth...');
        //   return reEstablishSession('/reauth', 5000).then(() => {
        //     console.log('re-established');
        //     fetch(url, config)
        //       .then(response => {
        //         console.log('made the fetch after re-establish');
        //         return response;
        //       })
        //       .then(resolve)
        //       .catch(reject);
        //   });
        // } else {
        //   return resolve(response);
        // }
      // })
      // .catch(reject);
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveSettings(path: string, data: any): Promise<Response> {
  return postWithReauth(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  // return fetch(path, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(data),
  // });
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
