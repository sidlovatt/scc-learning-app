import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

const VERSION_URL = 'https://raw.githubusercontent.com/sidlovatt/scc-learning-app/master/ota/version.json';

export async function initOta() {
  if (!Capacitor.isNativePlatform()) return;

  // Required on every launch to prevent the updater rolling back to the previous bundle.
  await CapacitorUpdater.notifyAppReady();

  try {
    const res = await fetch(VERSION_URL, { cache: 'no-store' });
    if (!res.ok) return;
    const latest = await res.json();
    if (!latest?.version || !latest?.url) return;

    const { bundle } = await CapacitorUpdater.current();
    if (bundle.version === latest.version) return;

    const downloaded = await CapacitorUpdater.download({
      url: latest.url,
      version: latest.version,
    });
    // Applies next time the app backgrounds or restarts - does not interrupt the current session.
    await CapacitorUpdater.next({ id: downloaded.id });
  } catch (err) {
    // Offline or GitHub unreachable - just keep running the current bundle.
    console.warn('OTA check failed', err);
  }
}
