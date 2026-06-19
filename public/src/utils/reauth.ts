/**
 * Session re-authentication.
 *
 * The Play session cookie expires after inactivity. When this happens, API
 * requests are redirected to Google OAuth login, which fails for AJAX calls.
 *
 * This module provides `ensureAuthenticated()`, which should be called before
 * every API request. It:
 *  1. Checks the `/isValid` endpoint to see if the session is still valid,
 *     and caches the result
 *  3. If the session has expired (419 response), opens a popup to `/reauth`
 *     which goes through the Google OAuth flow
 *  4. Prevents concurrent checks
 *  5. Once the popup completes auth and closes, verifies the session is valid
 *     again, then allows the original requests to proceed.
 */

let reauthInProgress: Promise<void> | null = null; // avoid concurrent checks
let lastValidCheck = 0;
const VALID_CHECK_TTL_MS = 30000;

/** Reset internal state — exported for testing only */
export function resetAuthState(): void {
  reauthInProgress = null;
  lastValidCheck = 0;
}

export function reauthViaPopup(): Promise<void> {
  return new Promise((resolve, reject) => {
    const popup = window.open('/reauth', 'reauth', 'width=600,height=700');

    if (!popup) {
      reject(new Error('Popup blocked'));
      return;
    }

    const timeout = setTimeout(() => {
      clearInterval(pollTimer);
      reject(new Error('Re-authentication timed out'));
    }, 120000);

    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer);
        clearTimeout(timeout);
        fetch('/isValid')
          .then((resp) => {
            if (resp.ok) {
              resolve();
            } else {
              reject(new Error('Re-authentication failed'));
            }
          })
          .catch(reject);
      }
    }, 500);
  });
}

export function ensureAuthenticated(): Promise<void> {
  if (reauthInProgress) {
    return reauthInProgress;
  }

  if (Date.now() - lastValidCheck < VALID_CHECK_TTL_MS) {
    return Promise.resolve();
  }

  return fetch('/isValid').then((response) => {
    if (response.status === 419) {
      reauthInProgress = reauthViaPopup().finally(() => {
        reauthInProgress = null;
        lastValidCheck = Date.now();
      });
      return reauthInProgress;
    }
    lastValidCheck = Date.now();
  });
}
