import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const SWITCH_SETTINGS_LOCK_DIR = path.join(os.tmpdir(), 'e2e-switch-settings.lock');

export async function acquireSwitchSettingsLock(): Promise<void> {
  const maxWaitMs = 15000;
  const start = Date.now();

  while (Date.now() - start <= maxWaitMs) {
    try {
      fs.mkdirSync(SWITCH_SETTINGS_LOCK_DIR);
      return;
    } catch (error: unknown) {
      if (!(error instanceof Error && 'code' in error && error.code === 'EEXIST')) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error('Timed out waiting to acquire the switch settings lock');
}

export function releaseSwitchSettingsLock(): void {
  try {
    fs.rmdirSync(SWITCH_SETTINGS_LOCK_DIR);
  } catch {
    // Already released or never acquired.
  }
}
