"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";
import { requireOwner } from "@/lib/auth";
import { mailIdentity } from "@/lib/mail/config";
import { escapeHtml, htmlToText } from "@/lib/mail/format";
import { BUCKET, getEmail, type Email } from "@/lib/mail/queries";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------- session

export async function signIn(_previous: string | null, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (error) return "Wrong email or password.";

  // A valid Supabase account that is not the mailbox owner gets no session here.
  const { data: owner } = await supabase.from("owners").select("user_id").maybeSingle();
  if (!owner) {
    await supabase.auth.signOut();
    return "This account has no access to the mailbox.";
  }

  redirect("/inbox");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---------------------------------------------------------------- mailbox

const refresh = () => revalidatePath("/", "layout");

export async function markThreadRead(threadId: string, read: boolean) {
  const { supabase } = await requireOwner();
  const thread = z.uuid().parse(threadId);

  if (read) {
    await supabase
      .from("emails")
      .update({ is_read: true })
      .eq("thread_id", thread)
      .eq("is_read", false)
      .throwOnError();
  } else {
    // "unread" means the newest message someone sent us; mail we sent is never unread
    const { data } = await supabase
      .from("emails")
      .select("id")
      .eq("thread_id", thread)
      .eq("direction", "in")
      .neq("folder", "trash")
      .order("received_at", { ascending: false })
      .limit(1)
      .throwOnError();
    if (data?.[0]) {
      await supabase.from("emails").update({ is_read: false }).eq("id", data[0].id).throwOnError();
    }
  }
  refresh();
}

export async function setStar(emailId: string, starred: boolean) {
  const { supabase } = await requireOwner();
  const { error } = await supabase
    .from("emails")
    .update({ is_starred: starred })
    .eq("id", emailId);
  if (error) throw error;
  refresh();
}

const MoveOp = z.enum(["archive", "inbox", "trash", "restore", "delete"]);
export type MoveOp = z.infer<typeof MoveOp>;

export async function moveThread(threadId: string, op: MoveOp) {
  const { supabase } = await requireOwner();
  const thread = z.uuid().parse(threadId);
  const emails = () => supabase.from("emails");

  switch (MoveOp.parse(op)) {
    case "archive":
      await emails().update({ folder: "archive" }).eq("thread_id", thread).eq("folder", "inbox").throwOnError();
      break;
    case "inbox":
      await emails().update({ folder: "inbox" }).eq("thread_id", thread).eq("folder", "archive").throwOnError();
      break;
    case "trash":
      await emails().update({ folder: "trash" }).eq("thread_id", thread).throwOnError();
      break;
    case "restore":
      // direction says where a message came from, so nothing else needs remembering
      await emails().update({ folder: "inbox" }).eq("thread_id", thread).eq("folder", "trash").eq("direction", "in").throwOnError();
      await emails().update({ folder: "sent" }).eq("thread_id", thread).eq("folder", "trash").eq("direction", "out").throwOnError();
      break;
    case "delete": {
      const { data } = await emails()
        .select("id, attachments(storage_path)")
        .eq("thread_id", thread)
        .eq("folder", "trash")
        .throwOnError();
      const rows = (data ?? []) as { id: string; attachments: { storage_path: string | null }[] }[];
      const paths = rows.flatMap((row) =>
        row.attachments.flatMap((file) => (file.storage_path ? [file.storage_path] : []))
      );
      if (paths.length > 0) await supabase.storage.from(BUCKET).remove(paths);
      // attachment rows go with their email (on delete cascade)
      if (rows.length > 0) {
        await emails().delete().in("id", rows.map((row) => row.id)).throwOnError();
      }
      break;
    }
  }
  refresh();
}

// ---------------------------------------------------------------- sending

const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;

const SendInput = z.object({
  from: z.email(),
  to: z.array(z.email()).min(1, "Add at least one recipient.").max(50),
  cc: z.array(z.email()).max(50),
  bcc: z.array(z.email()).max(50),
  subject: z.string().trim().max(500),
  html: z.string().max(500_000),
  /** The message being answered or forwarded; it is quoted below the new text. */
  quote: z.object({ id: z.string().min(1), mode: z.enum(["reply", "forward"]) }).optional(),
  attachments: z
    .array(
      z.object({
        path: z.string().regex(/^(in|out)\/[\w./-]+$/),
        filename: z.string().min(1).max(255),
        contentType: z.string().max(255),
        size: z.number().int().nonnegative(),
        /** true for files carried over from a forwarded message */
        copy: z.boolean(),
      })
    )
    .max(20),
});
export type SendInput = z.infer<typeof SendInput>;

function quoteBlock(original: Email, mode: "reply" | "forward"): string {
  const text = escapeHtml(original.body || htmlToText(original.body_html)).replace(/\n/g, "<br>");
  const date = new Date(original.received_at).toUTCString();

  if (mode === "reply") {
    return (
      `<br><div>On ${date}, ${escapeHtml(original.sender)} wrote:</div>` +
      `<blockquote style="margin:0 0 0 .8ex;border-left:1px solid #ccc;padding-left:1ex">${text}</blockquote>`
    );
  }
  return (
    `<br><div>---------- Forwarded message ---------<br>` +
    `From: ${escapeHtml(original.sender)}<br>Date: ${date}<br>` +
    `Subject: ${escapeHtml(original.subject)}<br>To: ${escapeHtml(original.recipient)}</div>` +
    `<br><div>${text}</div>`
  );
}

export async function sendEmail(
  input: SendInput
): Promise<{ ok: true; threadId: string } | { ok: false; error: string }> {
  const { supabase } = await requireOwner();

  const parsed = SendInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid message." };
  }
  const message = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const identity = mailIdentity();
  if (!apiKey || !identity.domain) {
    return { ok: false, error: "Sending is not configured (RESEND_API_KEY / RESEND_FROM)." };
  }
  const fromAddress = message.from.toLowerCase();
  if (!fromAddress.endsWith(`@${identity.domain}`)) {
    return { ok: false, error: `You can only send from @${identity.domain} addresses.` };
  }
  if (message.attachments.reduce((sum, file) => sum + file.size, 0) > MAX_ATTACHMENT_BYTES) {
    return { ok: false, error: "Attachments are limited to 25 MB per message." };
  }

  const original = message.quote ? await getEmail(supabase, message.quote.id) : null;
  if (message.quote && !original) {
    return { ok: false, error: "The original message no longer exists." };
  }
  const replyingTo = message.quote?.mode === "reply" ? original : null;

  const attach = Promise.all(
    message.attachments.map(async (file) => {
      let path = file.path;
      if (file.copy) {
        // a forwarded file gets its own copy, so deleting either message is safe
        path = `out/${crypto.randomUUID()}/${crypto.randomUUID()}`;
        const { error } = await supabase.storage.from(BUCKET).copy(file.path, path);
        if (error) throw new Error(`Could not attach ${file.filename}.`);
      }
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 600);
      if (error || !data) throw new Error(`Could not attach ${file.filename}.`);
      return { ...file, path, url: data.signedUrl };
    })
  );
  let files: Awaited<typeof attach>;
  try {
    files = await attach;
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not attach files." };
  }

  const subject = message.subject || "(no subject)";
  const html =
    `<div style="font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5">` +
    message.html +
    (original && message.quote ? quoteBlock(original, message.quote.mode) : "") +
    `</div>`;
  const text = htmlToText(html);
  const refs = replyingTo
    ? [replyingTo.refs, replyingTo.message_id].filter(Boolean).join(" ")
    : "";

  const from = identity.name ? `${identity.name} <${fromAddress}>` : fromAddress;
  const { data: sent, error: sendError } = await new Resend(apiKey).emails.send({
    from,
    to: message.to,
    cc: message.cc,
    bcc: message.bcc,
    subject,
    html,
    text,
    headers: replyingTo?.message_id
      ? {
          "In-Reply-To": `<${replyingTo.message_id}>`,
          References: refs.split(" ").map((id) => `<${id}>`).join(" "),
        }
      : undefined,
    attachments: files.map((file) => ({ filename: file.filename, path: file.url })),
  });
  if (sendError || !sent) {
    return { ok: false, error: sendError?.message ?? "Resend rejected the message." };
  }

  const threadId = replyingTo?.thread_id ?? crypto.randomUUID();
  const { error: saveError } = await supabase.from("emails").insert({
    id: sent.id,
    direction: "out",
    folder: "sent",
    thread_id: threadId,
    in_reply_to: replyingTo?.message_id ?? null,
    refs,
    sender: from,
    recipient: message.to.join(", "),
    cc: message.cc.join(", "),
    bcc: message.bcc.join(", "),
    subject,
    body: text,
    body_html: html,
    is_read: true,
    status: "sent",
    has_attachments: files.length > 0,
  });
  if (saveError) {
    console.error("Sent but not saved:", saveError);
    return { ok: false, error: "The email was sent, but could not be saved to Sent." };
  }

  if (files.length > 0) {
    await supabase.from("attachments").insert(
      files.map((file) => ({
        email_id: sent.id,
        filename: file.filename,
        content_type: file.contentType || "application/octet-stream",
        size: file.size,
        storage_path: file.path,
      }))
    );
  }
  if (replyingTo && !replyingTo.is_read) {
    await supabase.from("emails").update({ is_read: true }).eq("id", replyingTo.id);
  }

  refresh();
  return { ok: true, threadId };
}

// ---------------------------------------------------------------- push

const PushSubscription = z.object({
  endpoint: z.url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
});

export async function savePushSubscription(subscription: unknown) {
  const { supabase } = await requireOwner();
  const parsed = PushSubscription.parse(subscription);
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ endpoint: parsed.endpoint, subscription: parsed }, { onConflict: "endpoint" });
  if (error) throw error;
}
