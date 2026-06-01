import webpush from "web-push";
import type { PushSubscription } from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

function getVapidDetails() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_MAILTO ?? "mailto:reach@ahed.dev";

  if (!publicKey || !privateKey) {
    return null;
  }

  return { publicKey, privateKey, subject };
}

export function isPushConfigured(): boolean {
  return getVapidDetails() !== null;
}

export async function sendPush(
  subscription: PushSubscription,
  payload: PushPayload
): Promise<void> {
  const vapid = getVapidDetails();
  if (!vapid) {
    throw new Error("Web Push is not configured.");
  }

  webpush.setVapidDetails(vapid.subject, vapid.publicKey, vapid.privateKey);

  await webpush.sendNotification(subscription, JSON.stringify(payload));
}
