import type { SupabaseClient } from "@supabase/supabase-js";
import { extractAddresses } from "@/lib/mail/threading";

export const BUCKET = "attachments";

export const FOLDERS = ["inbox", "starred", "sent", "archive", "trash"] as const;
/** What the URL shows. "starred" is a filter, not a place a message is stored. */
export type Folder = (typeof FOLDERS)[number];
export type StoredFolder = Exclude<Folder, "starred">;

export function isFolder(value: string): value is Folder {
  return (FOLDERS as readonly string[]).includes(value);
}

export type Attachment = {
  id: string;
  email_id: string;
  filename: string;
  content_type: string;
  size: number;
  storage_path: string | null;
};

export type Email = {
  id: string;
  direction: "in" | "out";
  folder: StoredFolder;
  thread_id: string;
  message_id: string | null;
  refs: string;
  reply_to: string;
  sender: string;
  recipient: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  body_html: string;
  received_at: string;
  is_read: boolean;
  is_starred: boolean;
  status: string | null;
  has_attachments: boolean;
};

export type EmailWithFiles = Email & {
  attachments: (Attachment & { url: string | null })[];
};

/** One line in the message list. */
export type ThreadRow = {
  thread_id: string;
  folder: StoredFolder;
  last_id: string;
  direction: "in" | "out";
  sender: string;
  recipient: string;
  subject: string;
  snippet: string;
  last_at: string;
  message_count: number;
  unread: boolean;
  starred: boolean;
  has_attachments: boolean;
};

// Everything except the generated `search` vector, which is large and never shown.
const EMAIL_COLUMNS =
  "id, direction, folder, thread_id, message_id, refs, reply_to, sender, recipient, cc, bcc, subject, body, body_html, received_at, is_read, is_starred, status, has_attachments";

// A single message shaped like a ThreadRow, for Starred and search results.
const EMAIL_AS_ROW =
  "thread_id, folder, last_id:id, direction, sender, recipient, subject, snippet:body, last_at:received_at, is_read, starred:is_starred, has_attachments";

type EmailAsRow = Omit<ThreadRow, "message_count" | "unread"> & { is_read: boolean };

function toRows(data: EmailAsRow[] | null): ThreadRow[] {
  return (data ?? []).map(({ is_read, ...row }) => ({
    ...row,
    snippet: row.snippet.slice(0, 200),
    message_count: 1,
    unread: !is_read,
  }));
}

export async function listThreads(
  db: SupabaseClient,
  folder: Folder,
  limit: number
): Promise<ThreadRow[]> {
  if (folder === "starred") {
    const { data, error } = await db
      .from("emails")
      .select(EMAIL_AS_ROW)
      .eq("is_starred", true)
      .neq("folder", "trash")
      .order("received_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return toRows(data as EmailAsRow[] | null);
  }

  const { data, error } = await db
    .from("thread_list")
    .select("*")
    .eq("folder", folder)
    .order("last_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ThreadRow[];
}

export async function searchEmails(
  db: SupabaseClient,
  query: string,
  limit: number
): Promise<ThreadRow[]> {
  const { data, error } = await db
    .from("emails")
    .select(EMAIL_AS_ROW)
    .textSearch("search", query, { type: "websearch", config: "simple" })
    .neq("folder", "trash")
    .order("received_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return toRows(data as EmailAsRow[] | null);
}

/** Every message of a conversation, oldest first, with download links for its files. */
export async function getThread(
  db: SupabaseClient,
  threadId: string
): Promise<EmailWithFiles[]> {
  const { data, error } = await db
    .from("emails")
    .select(`${EMAIL_COLUMNS}, attachments(*)`)
    .eq("thread_id", threadId)
    .order("received_at", { ascending: true });
  if (error) throw error;

  const emails = (data ?? []) as unknown as (Email & { attachments: Attachment[] })[];
  return Promise.all(
    emails.map(async (email) => ({
      ...email,
      attachments: await Promise.all(
        email.attachments.map(async (file) => ({
          ...file,
          url: file.storage_path
            ? ((
                await db.storage
                  .from(BUCKET)
                  .createSignedUrl(file.storage_path, 3600, { download: file.filename })
              ).data?.signedUrl ?? null)
            : null,
        }))
      ),
    }))
  );
}

export async function getEmail(db: SupabaseClient, id: string): Promise<Email | null> {
  const { data, error } = await db
    .from("emails")
    .select(EMAIL_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Email | null;
}

/** Inbox conversations with something unread (the number on the sidebar badge). */
export async function unreadCount(db: SupabaseClient): Promise<number> {
  const { count } = await db
    .from("thread_list")
    .select("thread_id", { count: "exact", head: true })
    .eq("folder", "inbox")
    .eq("unread", true);
  return count ?? 0;
}

/** Addresses seen in recent mail: mine (on the mail domain) and everyone else's. */
export async function knownAddresses(
  db: SupabaseClient,
  domain: string
): Promise<{ mine: string[]; contacts: string[] }> {
  const { data } = await db
    .from("emails")
    .select("sender, recipient, cc")
    .order("received_at", { ascending: false })
    .limit(300);

  const all = new Set(
    (data ?? []).flatMap((row) =>
      extractAddresses(`${row.sender} ${row.recipient} ${row.cc}`)
    )
  );
  const mine = [...all].filter((address) => address.endsWith(`@${domain}`));
  const contacts = [...all].filter((address) => !address.endsWith(`@${domain}`));
  return { mine, contacts };
}
