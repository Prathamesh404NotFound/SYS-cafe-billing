/**
 * Service Worker Registration and Background Sync Manager
 */

export interface SWRegistrationCallbacks {
  onSyncTriggered?: (source: string) => void;
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: any) => void;
}

let swRegistration: ServiceWorkerRegistration | null = null;

/**
 * Register the Service Worker
 */
export async function registerServiceWorker(callbacks?: SWRegistrationCallbacks): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.info('Service workers are not supported in this browser.');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    swRegistration = registration;
    callbacks?.onRegistered?.(registration);

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New POS Service Worker update available.');
          }
        });
      }
    });

    // Listen to messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type === 'TRIGGER_FIRESTORE_SYNC') {
        callbacks?.onSyncTriggered?.(event.data.source || 'service-worker');
      }
    });

    return registration;
  } catch (err) {
    console.warn('Service Worker registration failed:', err);
    callbacks?.onError?.(err);
    return null;
  }
}

/**
 * Request Background Sync if supported (Chromium browsers)
 */
export async function requestBackgroundSync(tag = 'sync-pos-orders'): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = swRegistration || (await navigator.serviceWorker.ready);
    if ('sync' in registration) {
      // @ts-ignore - sync is in SyncManager
      await registration.sync.register(tag);
      return true;
    }
  } catch (err) {
    console.debug('Background sync registration not available:', err);
  }
  return false;
}

/**
 * Notify the Service Worker that a new offline order is waiting
 */
export function notifyServiceWorkerNewOrder(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'REQUEST_SYNC'
    });
  }
  // Also attempt background sync registration
  requestBackgroundSync('sync-pos-orders');
}
