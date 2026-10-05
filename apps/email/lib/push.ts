import type { SupabaseClient } from "@supabase/supabase-js";
import webpush from "web-push";
import type { PushSubscription, WebPushError } from "web-push";

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

/** Notify every subscribed device; forget subscriptions the browser has revoked. */
export async function notifyAll(db: SupabaseClient, payload: PushPayload): Promise<void> {
  if (!isPushConfigured()) return;

  const { data } = await db.from("push_subscriptions").select("endpoint, subscription");

  await Promise.all(
    (data ?? []).map(async (row) => {
      try {
        await sendPush(row.subscription as PushSubscription, payload);
      } catch (err) {
        const status = (err as WebPushError).statusCode;
        if (status === 404 || status === 410) {
          await db.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
        } else {
          console.error("Push notification failed:", err);
        }
      }
    })
  );
}
