/** Browser side of push reminders: permission, subscription and telling the server. */

export const pushSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const toKey = (b64: string) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

async function registration() {
  return navigator.serviceWorker.ready;
}

export async function pushEnabled(): Promise<boolean> {
  if (!pushSupported() || Notification.permission !== 'granted') return false;
  return (await (await registration()).pushManager.getSubscription()) !== null;
}

/** Asks permission, subscribes and saves the subscription. Returns an error message, or '' on success. */
export async function enablePush(): Promise<string> {
  if (!pushSupported()) return 'This browser cannot receive notifications. On iPhone, add Ranked to your Home Screen first.';
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') return 'Notifications are blocked. Allow them in your browser settings.';
  try {
    const key = (await (await fetch('/api/push/key')).json()).key as string;
    if (!key) return 'Reminders are not set up on the server yet.';
    const reg = await registration();
    const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(key) }));
    const res = await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub.toJSON()) });
    return res.ok ? '' : 'Could not save the reminder. Try again.';
  } catch {
    return 'Could not turn on reminders. Try again.';
  }
}

export async function disablePush(): Promise<void> {
  const sub = await (await registration()).pushManager.getSubscription();
  if (!sub) return;
  await fetch('/api/push/unsubscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ endpoint: sub.endpoint }) });
  await sub.unsubscribe();
}
