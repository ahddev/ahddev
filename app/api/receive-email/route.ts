import { Resend } from "resend";
import { NextResponse } from "next/server";
import type { EmailReceivedEvent } from "resend";
import {
  EMAILS_LIST_KEY,
  MAX_STORED_EMAILS,
  PUSH_SUB_KEY,
  type StoredEmail,
} from "@/lib/inbox";
import { isKvConfigured, kv } from "@/lib/kv";
import { isPushConfigured, sendPush } from "@/lib/push";
import type { PushSubscription } from "web-push";

export const runtime = "nodejs";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahddev.dev";
}

export async function POST(request: Request) {
  if (!isKvConfigured()) {
    return NextResponse.json(
      { error: "Inbox storage is not configured (KV)." },
      { status: 503 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const resend = new Resend(apiKey);

  let event: EmailReceivedEvent;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (webhookSecret) {
    const id = request.headers.get("svix-id");
    const timestamp = request.headers.get("svix-timestamp");
    const signature = request.headers.get("svix-signature");

    if (!id || !timestamp || !signature) {
      return NextResponse.json({ error: "Missing webhook headers." }, { status: 400 });
    }

    try {
      event = resend.webhooks.verify({
        payload: rawBody,
        headers: { id, timestamp, signature },
        webhookSecret,
      }) as EmailReceivedEvent;
    } catch {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
  } else {
    try {
      event = JSON.parse(rawBody) as EmailReceivedEvent;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const { email_id, from, to, subject, created_at } = event.data;
  const toAddress = Array.isArray(to) ? to.join(", ") : String(to);

  let text = "";
  try {
    const { data: email, error } = await resend.emails.receiving.get(email_id);
    if (error) {
      console.error("Failed to fetch received email body:", error);
    } else {
      text = email?.text ?? email?.html?.replace(/<[^>]+>/g, " ") ?? "";
    }
  } catch (err) {
    console.error("Receiving API error:", err);
  }

  const stored: StoredEmail = {
    id: email_id,
    to: toAddress,
    from,
    subject,
    text: text.trim(),
    date: created_at ?? new Date().toISOString(),
  };

  await kv.lpush(EMAILS_LIST_KEY, JSON.stringify(stored));
  await kv.ltrim(EMAILS_LIST_KEY, 0, MAX_STORED_EMAILS - 1);

  if (isPushConfigured()) {
    const subRaw = await kv.get<string>(PUSH_SUB_KEY);
    if (subRaw) {
      try {
        const subscription = JSON.parse(subRaw) as PushSubscription;
        await sendPush(subscription, {
          title: `Email: ${subject || "(no subject)"}`,
          body: `From ${from} → ${toAddress}`,
          url: `${siteUrl()}/get-emails`,
        });
      } catch (err) {
        console.error("Push notification failed:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, id: email_id });
}
