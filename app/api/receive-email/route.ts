import { Resend } from "resend";
import { NextResponse } from "next/server";
import type { EmailReceivedEvent } from "resend";
import type { StoredEmail } from "@/lib/inbox";
import { getPushSubscription, saveInboxEmail } from "@/lib/inbox-store";
import { isPushConfigured, sendPush } from "@/lib/push";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { PushSubscription } from "web-push";

export const runtime = "nodejs";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahddev.dev";
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Inbox storage is not configured (Supabase)." },
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
  let html = "";
  try {
    const { data: email, error } = await resend.emails.receiving.get(email_id);
    if (error) {
      console.error("Failed to fetch received email body:", error);
    } else {
      html = email?.html ?? "";
      text =
        email?.text?.trim() ||
        html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
    html: html.trim(),
    date: created_at ?? new Date().toISOString(),
  };

  try {
    await saveInboxEmail(stored);
  } catch (err) {
    console.error("Failed to save email to Supabase:", err);
    return NextResponse.json({ error: "Failed to store email." }, { status: 500 });
  }

  if (isPushConfigured()) {
    const subscription = await getPushSubscription();
    if (subscription) {
      try {
        await sendPush(subscription as PushSubscription, {
          title: `Email: ${subject || "(no subject)"}`,
          body: `From ${from} → ${toAddress}`,
          url: `${siteUrl()}/get-emails/${email_id}`,
        });
      } catch (err) {
        console.error("Push notification failed:", err);
      }
    }
  }

  return NextResponse.json({ ok: true, id: email_id });
}
