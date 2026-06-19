let reauthInProgress: Promise<void> | null = null;
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
