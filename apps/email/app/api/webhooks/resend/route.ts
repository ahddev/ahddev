import { Resend } from "resend";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { htmlToText } from "@/lib/mail/format";
import { BUCKET } from "@/lib/mail/queries";
import {
  hasReplyPrefix,
  matchBySubject,
  normalizeSubject,
  parseMessageIds,
  type ThreadCandidate,
} from "@/lib/mail/threading";
import { notifyAll } from "@/lib/push";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
// Copying attachments into Storage can take a while. 60s is allowed on every Vercel plan.
export const maxDuration = 60;

// Delivery events for mail we sent. "email.sent" only carries the Message-ID.
const STATUS_EVENTS = new Set([
  "email.sent",
  "email.delivered",
  "email.delivery_delayed",
  "email.bounced",
  "email.complained",
  "email.failed",
]);

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  const db = createAdminClient();

  // No secret means no way to tell Resend from anyone else, so refuse.
  if (!apiKey || !webhookSecret || !db) {
    return NextResponse.json({ error: "Mail webhook is not configured." }, { status: 503 });
  }

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return NextResponse.json({ error: "Missing webhook headers." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  let event;
  try {
    event = resend.webhooks.verify({
      payload: await request.text(),
      headers: { id, timestamp, signature },
      webhookSecret,
    });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  if (event.type === "email.received") {
    return receive(resend, db, event.data.email_id);
  }

  if (STATUS_EVENTS.has(event.type)) {
    const { email_id, message_id } = event.data as { email_id: string; message_id?: string };
    const [messageId] = parseMessageIds(message_id);

    const { error } = await db
      .from("emails")
      .update({
        ...(event.type === "email.sent" ? {} : { status: event.type.slice("email.".length) }),
        // lets a reply to this message be threaded by its In-Reply-To header
        ...(messageId ? { message_id: messageId } : {}),
      })
      .eq("id", email_id)
      .eq("direction", "out");

    if (error) {
      console.error("Failed to update delivery status:", error);
      return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

// Any non-2xx response makes Resend retry later, and every step here is safe to repeat.
async function receive(resend: Resend, db: SupabaseClient, emailId: string) {
  const { data: email, error } = await resend.emails.receiving.get(emailId);
  if (error || !email) {
    console.error("Failed to fetch received email:", error);
    return NextResponse.json({ error: "Could not fetch the email." }, { status: 502 });
  }

  const headers = Object.fromEntries(
    Object.entries(email.headers ?? {}).map(([name, value]) => [name.toLowerCase(), value])
  );
  const inReplyTo = parseMessageIds(headers["in-reply-to"])[0] ?? null;
  const refs = parseMessageIds(headers["references"]);
  const html = email.html ?? "";
  const subject = email.subject ?? "";

  const { data: inserted, error: insertError } = await db
    .from("emails")
    .upsert(
      {
        id: email.id,
        direction: "in",
        folder: "inbox",
        thread_id: await resolveThread(db, {
          ids: inReplyTo ? [inReplyTo, ...refs] : refs,
          subject,
          from: email.from,
        }),
        message_id: parseMessageIds(email.message_id)[0] ?? null,
        in_reply_to: inReplyTo,
        refs: refs.join(" "),
        reply_to: (email.reply_to ?? []).join(", "),
        sender: email.from,
        recipient: email.to.join(", "),
        cc: (email.cc ?? []).join(", "),
        bcc: (email.bcc ?? []).join(", "),
        subject,
        body: email.text?.trim() || htmlToText(html),
        body_html: html,
        received_at: email.created_at,
        has_attachments: email.attachments.length > 0,
      },
      // a retry must not undo read / archive / star done since the first delivery
      { onConflict: "id", ignoreDuplicates: true }
    )
    .select("id, thread_id");

  if (insertError) {
    console.error("Failed to save email:", insertError);
    return NextResponse.json({ error: "Failed to store email." }, { status: 500 });
  }

  const attachmentsStored =
    email.attachments.length === 0 || (await copyAttachments(resend, db, email.id));

  const saved = inserted?.[0];
  if (saved) {
    await notifyAll(db, {
      title: subject || "(no subject)",
      body: `From ${email.from}`,
      url: `/inbox/${saved.thread_id}`,
    });
  }

  if (!attachmentsStored) {
    return NextResponse.json({ error: "Some attachments were not stored." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id: email.id });
}

/** The conversation a new message belongs to, or a fresh id. */
async function resolveThread(
  db: SupabaseClient,
  message: { ids: string[]; subject: string; from: string }
): Promise<string> {
  if (message.ids.length > 0) {
    const { data } = await db
      .from("emails")
      .select("thread_id")
      .in("message_id", message.ids)
      .limit(1);
    if (data?.[0]) return data[0].thread_id;
  }

  const subject = normalizeSubject(message.subject);
  if (subject && (message.ids.length > 0 || hasReplyPrefix(message.subject))) {
    const { data } = await db
      .from("emails")
      .select("thread_id, subject, sender, recipient, cc")
      .ilike("subject", `%${subject.replace(/[\\%_]/g, "\\$&")}%`)
      .order("received_at", { ascending: false })
      .limit(50);
    const match = matchBySubject(message, (data ?? []) as ThreadCandidate[]);
    if (match) return match;
  }

  return crypto.randomUUID();
}

/** Copy the files out of Resend into our own bucket. Returns false if any copy failed. */
async function copyAttachments(
  resend: Resend,
  db: SupabaseClient,
  emailId: string
): Promise<boolean> {
  const { data: list, error } = await resend.emails.receiving.attachments.list({
    emailId,
    limit: 100,
  });
  if (error || !list) {
    console.error("Failed to list attachments:", error);
    return false;
  }

  let allStored = true;
  for (const file of list.data) {
    // Storage keys must be plain ASCII; the real filename lives in the table.
    const path = `in/${emailId}/${file.id}`;
    let stored = false;
    try {
      const response = await fetch(file.download_url);
      if (response.ok) {
        const upload = await db.storage
          .from(BUCKET)
          .upload(path, await response.arrayBuffer(), {
            contentType: file.content_type,
            upsert: true,
          });
        stored = !upload.error;
        if (upload.error) console.error("Attachment upload failed:", upload.error);
      }
    } catch (err) {
      console.error("Attachment download failed:", err);
    }
    allStored &&= stored;

    await db.from("attachments").upsert(
      {
        id: `${emailId}/${file.id}`,
        email_id: emailId,
        filename: file.filename || "attachment",
        content_type: file.content_type,
        size: file.size,
        storage_path: stored ? path : null,
      },
      { onConflict: "id" }
    );
  }
  return allStored;
}
